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

async function createEvent(uid, name, description, creator) {
    const sql = 'INSERT INTO events (uid, name, description, creator) VALUES (?, ?, ?, ?)';
    const params = [uid, name, description, creator];
    return await db.run(sql, params);
}

async function getEventsByUserUID(userUID) {
    const sql = `
        SELECT * FROM events 
        WHERE creator = ? 
        OR allowed LIKE ? 
        OR allowed LIKE ? 
        OR allowed LIKE ? 
        OR allowed = ?
    `;
    const params = [
        userUID, 
        `${userUID},%`, 
        `%,${userUID},%`, 
        `%,${userUID}`, 
        userUID
    ];
    return await db.all(sql, params);
}

async function isEventCreator(eventUID, userUID) {
    const sql = 'SELECT COUNT(*) as count FROM events WHERE uid = ? AND creator = ?';
    const result = await db.get(sql, [eventUID, userUID]);
    return result.count > 0;
}

async function GetEventCreatorByEventUID(eventUID) {
    const sql = 'SELECT creator FROM events WHERE uid = ?';
    return await db.get(sql, [eventUID]);
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
    createEvent,
    isEventCreator,
    getEventsByUserUID,
    GetEventCreatorByEventUID
};
