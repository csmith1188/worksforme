const jwt = require('jsonwebtoken');
const urlHelper = require('../util/urlHelper.js');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const userService = require('../services/userService.js');
const { getUserByUsername, registerUser } = require('../services/userService.js');

// Load login rules
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
async function wmLogin(req, res, next) {
    res.render('pages/loginSystem/WFMlogin', { title: 'WFM Login', loginRules });
}

async function postwmLogin(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(401).send('Invalid username or password');s
        }

        const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');

        if (user.password !== hashedPassword) {
            return res.status(401).send('Invalid username or password');
        }

        req.session.user = user;
        res.redirect('/');
    }
    catch (error) {
        res.status(500).send('Error logging in');
    }
}

//Register user system
async function registerNewUser(req, res, next) {
    res.render('pages/loginSystem/register', { title: 'Register', loginRules });
}

async function postRegisterNewUser(req, res, next) {
    const { username, password } = req.body;

    try {
        const existingUser = await getUserByUsername(username);

        if (existingUser) {
            return res.status(400).send('username taken')
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

        await registerUser(null, username, hashedPassword, salt);

        res.redirect('/user/WFMlogin');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
}

async function userExists(username) {
    const user = await getUserByUsername(username);
    return !!user;
}

//Get rid of all session data
function logout(req, res) {
    req.session.destroy((err) => {
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
    userExists
}