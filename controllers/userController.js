const jwt = require('jsonwebtoken');
const urlHelper = require('../util/urlHelper.js');

const userService = require('../services/userService.js');

async function login(req, res, next) {

    const path = req.get('Referer');
    const host = req.get('Host');
    const protocol = req.protocol;

    //for when done
    req.session.redirectURL = path;

    if (!req.query.token) {

        //for formbar
        let formbarAuthURL = process.env.FB_AUTH_URL;
        const redirectURL = `${protocol}://${host}/user/login`;
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

function logout(req, res){
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Failed to destroy session.");
        }
        res.redirect('/');
    });
}

module.exports = {
    login,
    logout
}