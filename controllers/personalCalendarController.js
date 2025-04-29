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

async function importGoogleCalendar(req, res) {

    if (!req.session.user.googleID) {
        return res.status(403).send("User not logged in with Google.");
    }

    
    res.send(calendarObject);
}

module.exports = {
    getCalendarData,
    saveCalendarData
};