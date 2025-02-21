const path = require('path');
const sql = require('sqlite3').verbose();
const db = require('../util/dbAsyncWrapper');

async function getUidByNameOrEmail(input) {
    const sql = 'SELECT uid FROM users WHERE username = ? OR email = ?';
    return await db.get(sql, [input, input]);
}

async function getusernameByUid(uid) {
    const sql = 'SELECT username FROM users WHERE uid = ?';
    return await db.get(sql, [uid]);
}

async function addUserToEvent(uid, eventUID) {
    const sql = 'UPDATE events SET allowed = ? WHERE uid = ?';
    return await db.run(sql, [eventUID, uid]);
}

async function inviteNotifications(notif_type, sending_user, receiving_user_uid, event, notif_content) {
    const sql = 'INSERT INTO notifications (notif_type, sending_user, receiving_user_uid, event, notif_content) VALUES (?, ?, ?, ?, ?)';
    const params = [notif_type, sending_user, receiving_user_uid, event, notif_content];
    return await db.run(sql, params);
}

async function getEventNameByUID(uid) {
    const sql = 'SELECT name FROM events WHERE uid = ?';
    return await db.get(sql, [uid]);
}

async function getNotificationsByUID(uid) {
    const sql = 'SELECT * FROM notifications WHERE notif_uid';
    return await db.all(sql, [uid]);
}

async function getEventUIDByEventName(name) {
    const sql = 'SELECT uid FROM events WHERE name = ?';
    return await db.get(sql, [name]);
}

module.exports = {
    getUidByNameOrEmail,
    getusernameByUid,
    addUserToEvent,
    inviteNotifications,
    getEventNameByUID,
    getNotificationsByUID,
    getEventUIDByEventName
};