const path = require('path');
const sql = require('sqlite3').verbose();
const db = require('../util/dbAsyncWrapper');
const dateRanker = require('./rankDates');

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

module.exports = {
    getAllEvents,
    getEventByUID,
    updateEventName,
    updateEventDescription,
    deleteEvent,
    createEvent
};
