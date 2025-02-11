const express = require('express');
const router = express.Router();
const db = require('../util/dbAsyncWrapper');
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.get('/calendar', auth, async (req, res) => {
    const sql = 'SELECT * FROM events';
    let rows = await db.all(sql);
    res.render('pages/event', { events: rows });
});

router.get('/createEvent', auth, async (req, res) => {
    res.render('pages/createEvent');
});

router.get('/eventPage/:aEvent', auth, async (req, res) => {
    const aEvent = req.params.aEvent;

    db.all('SELECT user, content, date FROM event_page WHERE events = ? ORDER BY date ASC;', [aEvent], (err, rows) => {
        if (err) {
            console.error(err);
            res.send("ERROR:\n" + err);
        } else {
            res.render('eventPage', { user: req.session.user, aEvent: aEvent, event_page: rows });
        }
    });
});


//temporary code
//move to eventController and eventroutes later -chicken sandwich
router.post('/eventPage/:aEvent', (req, res) => {
    const aEvent = req.params.aEvent;
    const user = req.session.user;
    const message = req.body.message;
    const date = new Date().toISOString();

    db.run('INSERT INTO event_page (user, forum, content, date) VALUES (?, ?, ?, ?);', [user, aEvent, message, date], (err) => {
        if (err) {
            res.send('DB ERROR:\n' + err);
        } else {
            res.redirect(`/eventPage/${aEvent}`);
        }
    });
});


router.post('/createEvent', auth, async (req, res) => {
    const { uid, name, description } = req.body;
    const sql = 'INSERT INTO events (uid, name, description) VALUES (?, ?, ?)';
    const params = [uid, name, description];
    
    await db.run(sql, params);
    res.redirect('/event/calendar');

});

module.exports = router;