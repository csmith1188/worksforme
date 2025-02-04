const jwt = require('jsonwebtoken');
const urlHelper = require('../util/urlHelper.js');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const userService = require('../services/userService.js');
const { getUserByUsername, registerUser } = require('../services/userService.js');

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
        res.render('error', { error: new Error('Error logging in') });
    }
}

//WFM login system
async function wmLogin(req, res) {
    res.render('pages/loginSystem/WFMlogin', { title: 'WFM Login', loginRules });
}

async function postwmLogin(req, res) {
    const { username, password } = req.body;

    try {
        const user = await getUserByUsername(username);
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
    const { username, password } = req.body;

    try {
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.json({ success: false, message: 'Username is already taken' });
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

        await registerUser(null, username, hashedPassword, salt);

        return res.json({ success: true, redirect: '/user/WFMlogin' });
    } catch (error) {
        return res.json({ success: false, message: 'Error registering user' });
    }
}

//Check if user exists
async function userExists(req, res) {
    const { username } = req.body;
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

module.exports = {
    formbar,
    logout,
    wmLogin,
    postwmLogin,
    registerNewUser,
    postRegisterNewUser,
    userExists,
    calendarPage
};