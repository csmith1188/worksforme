const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

router.get('/event', auth, (req, res) => {
    res.render('pages/event');
});

router.get('/user/inbox', auth, (req, res) => {
    res.render('pages/notificationSystem/inbox');
});

module.exports = router;