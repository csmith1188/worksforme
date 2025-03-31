const jwt = require('jsonwebtoken');
const urlHelper = require('../util/urlHelper.js');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const sanitizeInput = require('../util/sanitizeInput');
const { MEMBER, OWNER, ADMIN } = require('../middleware/consts.js');

const userService = require('../services/userService.js');
const { getUserByUsernameOrEmail, registerUser } = require('../services/userService.js');
const notifservice = require('../services/notifService.js');
const memberHandle = require('../services/memberHandle.js');

// Use for the members table
const member = 2;
const admin = 1;
const owner = 0;

//Load login rules
const loginRulesPath = path.join(__dirname, '../rules/loginRules.json');
const loginRules = JSON.parse(fs.readFileSync(loginRulesPath, 'utf8'));

//Formbar login system
async function formbar(req, res, next) {
    const path = req.get('Referer');
    const host = req.get('Host');
    const protocol = req.protocol;

    //for when done
    req.session.redirectURL = path;

    if (!req.query.token) {

        //for formbar
        let formbarAuthURL = process.env.FB_AUTH_URL;
        const redirectURL = `${protocol}://${host}/user/formbar`;
        formbarAuthURL = urlHelper.addQueryParams(formbarAuthURL, { redirectURL });
        return res.redirect(formbarAuthURL);
    }

    const tokenData = jwt.decode(req.query.token);
    req.session.token = tokenData;

    try {
        const existingUser = await userService.getUserByFormbarID(tokenData.id);
        if (existingUser) {
            req.session.user = existingUser;
            return next();
        }

        const uid = await userService.registerUser(tokenData.id, tokenData.username);
        const newUser = await userService.getUserByUID(uid);
        req.session.user = newUser;
        return next();
    } catch (error) {
        console.log(error);
        res.render('pages/error', { error: new Error('Error logging in') });
    }
}

//WFM login system
async function wmLogin(req, res) {
    res.render('pages/loginSystem/WFMlogin', { title: 'WFM Login', loginRules });
}

async function postwmLogin(req, res) {
    let { username, password } = req.body;
    username = sanitizeInput(username);

    try {
        const user = await getUserByUsernameOrEmail(username);
        if (!user) {
            return res.json({ success: false, message: 'Invalid username or password' });
        }

        const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');

        if (user.password !== hashedPassword) {
            return res.json({ success: false, message: 'Invalid username or password' });
        }

        req.session.user = user;
        return res.json({ success: true, redirect: '/' });
    } catch (error) {
        return res.json({ success: false, message: 'Error logging in' });
    }
}

//Register user system
async function registerNewUser(req, res) {
    res.render('pages/loginSystem/register', { title: 'Register', loginRules });
}

async function postRegisterNewUser(req, res) {
    let { username, email, password } = req.body;
    username = sanitizeInput(username);
    email = sanitizeInput(email);

    // Check for valid email (thx google)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.json({ success: false, message: 'Invalid email format' });
    }

    try {
        const existingUser = await getUserByUsernameOrEmail(username);
        if (existingUser) {
            return res.json({ success: false, message: 'Username is already taken' });
        }

        const existingEmail = await userService.getUserByEmail(email);
        if (existingEmail) {
            return res.json({ success: false, message: 'Email is already taken' });
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

        await registerUser(null, username, email, hashedPassword, salt);

        return res.json({ success: true, redirect: '/user/WFMlogin' });
    } catch (error) {
        return res.json({ success: false, message: 'Error registering user' });
    }
}

// Check if user exists
async function userExists(req, res) {
    let { username } = req.body;
    username = sanitizeInput(username);
    const user = await getUserByUsername(username);
    return res.json({ exists: !!user });
}

function calendarPage(req, res) {
    res.render('pages/calendar', { title: 'Calendar' });
}

//Logout
function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Failed to destroy session.");
        }
        res.redirect('/');
    });
}

//Inbox System
async function inboxPage(req, res) {
    res.render('pages/notificationSystem/inbox.ejs', { title: 'Inbox' });
}

async function postInboxPage(req, res) {
    try {
        const notifications = await userService.getNotificationsByUser(req.session.user.uid);
        res.json({ success: true, notifications });
    } catch (error) {
        res.json({ success: false, message: 'Error fetching notifications' });
    }
}

async function add(req, res) {
    const notifUID = req.body.notif_uid;
    const action = req.body.action;

    try {
        if (action === 'accept') {
            const notifData = await notifservice.getNotificationsByUID(notifUID);

            if (!notifData) {
                return res.json({ success: false, message: 'Notification not found' });
            }

            const eventUID = notifData[0].event_uid;

            if (!eventUID) {
                return res.json({ success: false, message: 'Event not found' });
            }

            await memberHandle.insertMembers(eventUID, notifData[0].receiving_user_uid, MEMBER);

            await notifservice.deleteNotification(notifUID);

            return res.json({ success: true });
        }

        if (action === 'reject') {
            await notifservice.deleteNotification(notifUID);
            return res.json({ success: true });
        }

        res.json({ success: false, message: 'Invalid action' });
    } catch (error) {
        console.error('Error handling notification action:', error);
        res.json({ success: false, message: 'Error handling notification action' });
    }
}

module.exports = {
    formbar,
    logout,
    wmLogin,
    postwmLogin,
    registerNewUser,
    postRegisterNewUser,
    userExists,
    calendarPage,
    inboxPage,
    postInboxPage,
    add
};