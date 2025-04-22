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

async function inviteNotifications(notif_type, sending_user, receiving_user_uid, event, notif_content, timestamp, eventUID) {
    const sql = 'INSERT INTO notifications (notif_type, sending_user, receiving_user_uid, event, notif_content, timestamp, event_uid) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const params = [notif_type, sending_user, receiving_user_uid, event, notif_content, timestamp, eventUID];
    return await db.run(sql, params);
}

async function getEventNameByUID(uid) {
    const sql = 'SELECT name FROM events WHERE uid = ?';
    return await db.get(sql, [uid]);
}

async function getNotificationsByUID(uid) {
    const sql = 'SELECT * FROM notifications WHERE uid = ?';
    return await db.all(sql, [uid]);
}

async function getEventUIDByEventName(name) {
    const sql = 'SELECT uid FROM events WHERE name = ?';
    return await db.get(sql, [name]);
}

async function getNotificationsByUser(uid) {
    const sql = 'SELECT * FROM notifications WHERE receiving_user_uid = ?';
    return await db.all(sql, [uid]);
}

async function deleteNotification(uid) {
    const sql = 'DELETE FROM notifications WHERE uid = ?';
    return await db.run(sql, [uid]);
}

module.exports = {
    getUidByNameOrEmail,
    getusernameByUid,
    inviteNotifications,
    getEventNameByUID,
    getNotificationsByUID,
    getEventUIDByEventName,
    deleteNotification,
    getNotificationsByUser
};