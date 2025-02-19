const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/about');
    }
    res.redirect('/test');
});

router.get('/about', (req, res) => {
    res.render('pages/index', {
        isLoggedIn: res.locals.isLoggedIn,
        user: res.locals.user
    });
});

router.get('/test', auth, (req, res) => {
    res.render('pages/test');
});

module.exports = router;