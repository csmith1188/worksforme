const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController.js');
const auth = require('../middleware/auth.js');

router.get('/events', auth, eventController.events);

router.get('/createEvent', auth, eventController.createEvent);

router.get('/eventPage/:aEvent', auth, eventController.eventPage);

router.post('/eventPage/:aEvent', auth, eventController.postEventPage);

router.post('/createEvent', auth, eventController.postCreateEvent);

router.post('/invite', auth, eventController.invite);

router.post('/calculateDate/:eventID', auth, eventController.calculateDate);

router.post('/createPoll', eventController.createPoll);

router.post('/vote', eventController.vote);

module.exports = router;