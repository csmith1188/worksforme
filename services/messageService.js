const db = require('../util/dbAsyncWrapper');
const calenderService = require('./personalCalendarService');
const dateRanker = require('./rankDates');
const DaySchedule = require('./DaySchedule');
const dayjs = require('dayjs');

async function addBoard(event, name) {
    const sql = 'INSERT INTO boards (event_uid, name) VALUES (?, ?)';
    return await db.run(sql, [event, board]);
}

module.exports = {
    addBoard
};