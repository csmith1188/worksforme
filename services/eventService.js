const path = require('path');
const sql = require('sqlite3').verbose();
const db = require('../util/dbAsyncWrapper');
const calenderService = require('./personalCalendarService');
const dateRanker = require('./rankDates');
const DaySchedule = require('./DaySchedule');
const dayjs = require('dayjs');

// Getting events or creating
async function getAllEvents() {
    const sql = 'SELECT * FROM events';
    return await db.all(sql);
}

async function getEventByUID(uid) {
    const sql = 'SELECT * FROM events WHERE uid = ?';
    return await db.get(sql, [uid]);
}

async function createEvent(name, description) {
    const sql = 'INSERT INTO events (name, description) VALUES (?, ?)';
    const params = [name, description];
    return await db.run(sql, params);
}

async function getEventUIDByName(name) {
    const sql = 'SELECT uid FROM events WHERE name = ?';
    return await db.get(sql, [name]);
}

async function getEventMembers(eventUID) {
    const sql = 'SELECT * FROM members WHERE event_uid = ?';
    return await db.all(sql, [eventUID]);
}

// Modifying events
async function updateEventName(uid, newName) {
    const sql = 'UPDATE events SET name = ? WHERE uid = ?;';
    return await db.run(sql, [newName, uid]);
}

async function updateEventDescription(uid, newDescription) {
    const sql = 'UPDATE events SET description = ? WHERE uid = ?;';
    return await db.run(sql, [newDescription, uid]);
}

async function deleteEvent(uid) {
    const sql = 'DELETE FROM events WHERE uid = ?';
    return await db.run(sql, [uid]);
}

async function setEventDateTime(eventUID, date, minutes){
    const dateTime = dayjs(date).add(minutes, 'minutes').toISOString();
    const sql = 'UPDATE events SET date_time = ? WHERE uid = ?';
    await db.run(sql, [dateTime, eventUID]);
}

async function calculateOptimalDates(eventUID, minDate, maxDate, startMins, endMins) {
    const members = await getEventMembers(eventUID);
    let calendars = [];

    for (let member of members) {
        let memberUID = member.members; // chicken, what?
        let dbCalendar = await calenderService.getUserCalendar(memberUID);
        let calendar = {};
        Array.from(dbCalendar).forEach(([date, busyTimeObjects]) => {
            // convert busy time objects into arrays that the algorithm uses
            calendar[date] = new DaySchedule(busyTimeObjects.map(busyTime => [busyTime.start, busyTime.end]));
        });

        calendars.push(calendar);
    }

    return dateRanker(calendars, startMins, endMins, minDate, maxDate);
}

module.exports = {
    getAllEvents,
    getEventByUID,
    updateEventName,
    updateEventDescription,
    deleteEvent,
    createEvent,
    getEventUIDByName,
    setEventDateTime,
    calculateOptimalDates
};
