const express = require('express');
const router = express.Router();
const db = require('../util/dbAsyncWrapper');
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.get('/calendar', auth, async (req, res) => {
    res.render('pages/event');
});

router.get('/createEvent', auth, async (req, res) => {
    res.render('pages/createEvent');
});

router.post('/createEvent', auth, async (req, res) => {
    const { name, description } = req.body;
    const sql = 'INSERT INTO events (name, description) VALUES (?, ?)';
    const params = [name, description];
    
    await db.run(sql, params);
    res.redirect('/event/calendar');

});

module.exports = router;