const express = require('express');
const router = express.Router();
const personalCalendarController = require('../controllers/personalCalendarController');
const auth = require('../middleware/auth');

router.post('/get-calendar-data', auth, personalCalendarController.getCalendarData);

module.exports = router;