const path = require('path');
const sql = require('sqlite3').verbose();
const db = require('../util/dbAsyncWrapper');

async function getUserCalendar(userUID){
    let dates = await db.all('SELECT * FROM calendar_dates WHERE user_uid = ?;', [userUID]);
    let datesMap = new Map();

    dates.forEach(date => {
        const newBusyTime = {
            uid: date.uid,
            start: date.start_time,
            end: date.end_time
        };

        if (datesMap.has(date.date)) {
            datesMap.get(date.date).push(newBusyTime);
        } else {
            datesMap.set(date.date, [newBusyTime]);
        }

    });

    return datesMap;
};

async function saveUserCalendar(userUID, newDatesMap){
    let currentDatesMap = await getUserCalendarCalendar(userUID);

    Array.from(newDatesMap).forEach(async ([date, busyTimes]) => {
        // If the date is already in the database, update the busy times
        if (currentDatesMap.has(date)) {
            busyTimes.forEach(async ([start, end], index) => {
            });
        } else {
            
        }
    });

}

module.exports = {
    getUserCalendar,
    saveUserCalendar
}