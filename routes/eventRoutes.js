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
//temporary code
//move to eventController and eventroutes later -chicken sandwich
router.get('/page', auth, (req, res) => {
    console.log('page for forums');

    db.all('SELECT title FROM forum;', (err, rows) => {
        if (err) {
            res.send("ERROR:\n" + err);
            console.error(err);
        } else {
            res.render('page', { user: req.session.user, forums: rows });
        }
    });
});

router.post('/page', (req, res) => {
    const aForum = req.body.aForum;
    const user = req.session.user;

    console.log(req.body.aForum);
    console.log(req.session.user);

    db.run('INSERT INTO forum (creator, title) VALUES (?, ?);', [user, aForum], (err) => {
        if (err) {
            res.send('DB ERROR:\n' + err);
        } else {
            res.redirect('/page');
        }
    });
});

router.get('/chatroom/:aForum', auth, (req, res) => {
    const aForum = req.params.aForum;

    console.log('chatroom for forum:', aForum);

    db.all('SELECT user, content, date FROM messages WHERE forum = ? ORDER BY date ASC;', [aForum], (err, rows) => {
        if (err) {
            console.error(err);
            res.send("ERROR:\n" + err);
        } else {
            res.render('chatroom', { user: req.session.user, aForum: aForum, messages: rows });
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