const { google } = require('googleapis');
const personalCalendarService = require('../services/personalCalendarService');
const googleHelper = require('../util/googleWrapper');

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

    if (!req.session.user.google_id) {
        return res.status(403).send("User not logged in with Google.");
    }

    try {
        /*oauth2Client.setCredentials({
            refresh_token: req.session.user.google_refresh_token
        });*/

        const oauth2Client = googleHelper.createOAuthClient(req.session.user.google_refresh_token);

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const events = await calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            singleEvents: true,
            maxResults: 10,
        });

        res.json(events.data.items);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving calendar events');
    }

}

module.exports = {
    getCalendarData,
    saveCalendarData,
    importGoogleCalendar
};