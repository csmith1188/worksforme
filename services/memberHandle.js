const path = require('path');
const sql = require('sqlite3').verbose();
const db = require('../util/dbAsyncWrapper');
const dateRanker = require('./rankDates');

async function insertMembers(eventUID, members, permission) {
    const sql = 'INSERT INTO members (event_uid, members, permission) VALUES (?, ?, ?)';
    const params = [eventUID, members, permission];
    return await db.run(sql, params);
}

async function getMembers() {
    const sql = 'SELECT * FROM members';
    return await db.get(sql);
}

async function getMemberPermission(eventUID, member) {
    const sql = 'SELECT permission FROM members WHERE event_uid = ? AND members = ?';
    const params = [eventUID, member];
    return await db.get(sql, params);
}

async function getEventsByMember(member) {
    const sql = 'SELECT event_uid FROM members WHERE members = ?';
    const params = [member];
    return await db.all(sql, params);
}

async function getMembersByEvent(eventUID) {
    const sql = 'SELECT members FROM members WHERE event_uid = ?';
    const params = [eventUID];
    return await db.all(sql, params);
}

module.exports = {
    insertMembers,
    getMembers,
    getMemberPermission,
    getEventsByMember,
    getMembersByEvent
};
