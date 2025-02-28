const path = require('path');
const sql = require('sqlite3').verbose();
const db = require('../util/dbAsyncWrapper');

async function getUserCalendar(userUID){
    let dates = await db.all('SELECT * FROM calendar_dates WHERE user_uid = ?;', [userUID]);
    let datesMap = new Map();

    dates.forEach(date => {
        if (datesMap.has(date.date)) {
            datesMap.get(date.date).push([date.start, date.end]);
        } else {
            datesMap.set(date.date, [[date.start, date.end]]);
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