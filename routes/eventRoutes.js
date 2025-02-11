const express = require('express');
const router = express.Router();
const db = require('../util/dbAsyncWrapper');
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.get('/calendar', auth, async (req, res) => {
    const { uid, name, description,  } = req.body;
    const sql = 'SELECT * FROM events';
    let rows = await db.all(sql);
    console.log(rows);
    res.render('pages/event', { events: rows });
});

router.get('/createEvent', auth, async (req, res) => {
    res.render('pages/createEvent');
});
//temporary code
//move to eventController and eventroutes later -chicken sandwich
router.post('/createEvent', auth, async (req, res) => {
    const { uid, name, description } = req.body;
    const sql = 'INSERT INTO events (uid, name, description, creator) VALUES (?, ?, ?, ?)';
    const params = [uid, name, description, creator];
    
    await db.run(sql, params);
    res.redirect('/event/calendar');

});

module.exports = router;