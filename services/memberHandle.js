const path = require('path');
const sql = require('sqlite3').verbose();
const db = require('../util/dbAsyncWrapper');
const dateRanker = require('./rankDates');

async function insertMembers(eventUID, members, permission) {
    const sql = 'INSERT INTO members (event_uid, members, permission) VALUES (?, ?, ?)';
    const params = [eventUID, members, permission];
    return await db.run(sql, params);
}

module.exports = {
    insertMembers
};
