const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

router.get('/calender', auth, async(req, res) => {
    res.render('pages/event');
});

router.get('/createEvent', auth, async(req, res) => {
    res.render('pages/createEvent');
});

router.post('/createEvent', auth, async(req, res) => {
    
}); 

module.exports = router;