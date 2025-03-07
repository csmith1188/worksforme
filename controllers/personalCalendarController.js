const personalCalendarService = require('../services/personalCalendarService');

async function getCalendarData(req, res) {
    const userUID = req.session.user.uid;
    const calendarMap = await personalCalendarService.getUserCalendar(userUID);
    const calendarObject = Object.fromEntries(calendarMap);
    res.send(calendarObject);
}

async function saveCalendarData(req, res) {
    const userUID = req.session.user.uid;
    const editList = req.body;
    try {
        await personalCalendarService.saveUserCalendar(userUID, editList.createdBlocks, editList.editedBlocks, editList.deletedBlockUIDs);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
}

module.exports = {
    getCalendarData,
    saveCalendarData
};