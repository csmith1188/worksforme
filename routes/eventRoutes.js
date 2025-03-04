const express = require('express');
const router = express.Router();
const db = require('../util/dbAsyncWrapper');
const auth = require('../middleware/auth');
const eventController = require('../controllers/eventController');

router.get('/events', auth, eventController.events);

router.get('/createEvent', auth, eventController.createEvent);

router.get('/createEventMB', auth, eventController.createEventMB);

router.get('/eventPage/:aEvent', auth, eventController.eventPage);

router.post('/eventPage/:aEvent', auth, eventController.postEventPage);

router.post('/createEvent', auth, eventController.postCreateEvent);

router.post('/createEventMB', auth, eventController.postCreateMB);

router.post('/invite', auth, eventController.invite);

module.exports = router;