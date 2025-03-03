const personalCalendarService = require('../services/personalCalendarService');

async function getCalendarData(req, res) {
    const userUID = req.session.user.uid;
    const calendarMap = await personalCalendarService.getUserCalendar(userUID);
    const calendarObject = Object.fromEntries(calendarMap);
    res.send(calendarObject);
}

module.exports = {
    getCalendarData
};