const jwt = require('jsonwebtoken');
const urlHelper = require('../util/urlHelper.js');
const crypto = require('crypto');

const userService = require('../services/userService.js');

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
        formbarAuthURL = urlHelper.addQueryParams(formbarAuthURL, {redirectURL});

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

        res.render('error', {error: new Error('Error logging in')});

    }

}

//WFM login system
async function wmLogin(req, res, next) {
    res.render('pages/loginSystem/WFMlogin', {title: 'WFM Login', rules: '/rules/loginRules'});
}

async function postwmLogin(req, res, next) {  
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await userService.getUserByFormbarID(username);

        if (!user) {
            return res.render('pages/loginSystem/WFMlogin', {title: 'WFM Login', rules: '/rules/loginRules', error: 'Invalid username or password'});
        }

        const hash = crypto.createHash('sha256');
        hash.update(password + user.salt);
        const hashedPassword = hash.digest('hex');

        if (hashedPassword !== user.password) {
            return res.render('pages/loginSystem/WFMlogin', {title: 'WFM Login', rules: '/rules/loginRules', error: 'Invalid username or password'});
        }

        req.session.user = user;
        return next();

    } catch (error) {
        res.render('error', {error: new Error('Error logging in')});
    }
}

//Get rid of all session data
function logout(req, res){
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
    postwmLogin
}