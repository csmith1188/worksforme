const express = require('express');
const router = express.Router();
const db = require('../util/dbAsyncWrapper');
const auth = require('../middleware/auth');
const eventController = require('../controllers/eventController');
//this is where all the pages are rendered and the post requests are handled
router.get('/events', auth, eventController.events);

router.get('/createEvent', auth, eventController.createEvent);

router.get('/createEventMB', auth, eventController.createMB);

router.get('/eventPage/:aEvent', auth, eventController.eventPage);

router.get('/eventpage/:aEvent/:aMB', auth, eventController.eventMB);

router.post('/eventPage/:aEvent', auth, eventController.postEventPage);

router.post('/eventpage/:aEvent/:aMB', auth, eventController.posteventMB);

router.post('/event/:aEvent/addMessageBoard', auth, eventController.addMessageBoard);

router.post('/createEvent', auth, eventController.postCreateEvent);

router.post('/createEventMB', auth, eventController.postCreateMB);

router.post('/invite', auth, eventController.invite);

router.post('/calculateDate/:eventID', auth, eventController.calculateDate);

module.exports = router;