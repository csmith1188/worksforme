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
    const eventSql = 'SELECT * FROM events';
    const usersSql = 'SELECT * FROM users';
    res.render('pages/createEvent');
});

router.get('/eventPage/:aEvent', auth, async (req, res) => {
    const aEvent = req.params.aEvent;
    const sql = 'SELECT * FROM events WHERE uid = ?';
    const event = await db.get(sql, [aEvent]);

    if (!event) {
        return res.status(404).send('Event not found');
    }

    res.render('pages/eventPage', {event});
});


//temporary code
//move to eventController and eventroutes later -chicken sandwich
router.post('/eventPage/:aEvent', auth, async (req, res) => {
    const aEvent = req.params.aEvent;
    const newEventName = req.body.newEventName;
    const newEventDesc = req.body.newEventDesc;
    const deleteEvent = req.body.deleteEvent;

    if (newEventName) {
        const updateName = 'UPDATE events SET name = ? WHERE uid = ?;';
        await db.run(updateName, [newEventName, aEvent]);
    }

    if (newEventDesc) {
        const updateDesc = 'UPDATE events SET description = ? WHERE uid = ?;';
        await db.run(updateDesc, [newEventDesc, aEvent]);
    }

    if (deleteEvent) {
        const deleteSql = 'DELETE FROM events WHERE uid = ?';
        await db.run(deleteSql, [aEvent]);
    }

    res.redirect(`/event/eventPage/${aEvent}`);
});

router.post('/createEvent', auth, async (req, res) => {
    const { uid, name, description } = req.body;
    const creator = req.session.user.uid;
    const sql = 'INSERT INTO events (uid, name, description, creator) VALUES (?, ?, ?, ?)';
    const params = [uid, name, description, creator];
    
    await db.run(sql, params);
    res.redirect('/event/calendar');

});

module.exports = router;