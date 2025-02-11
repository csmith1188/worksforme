const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

router.get('/event', auth, (req, res) => {
    res.render('pages/event');
});

module.exports = router;