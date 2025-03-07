const express = require('express');
const router = express.Router();
const personalCalendarController = require('../controllers/personalCalendarController');
const auth = require('../middleware/auth');

router.post('/get-calendar-data', auth, personalCalendarController.getCalendarData);
router.post('/save-calendar-data', auth, personalCalendarController.saveCalendarData);

module.exports = router;