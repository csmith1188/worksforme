const path = require('path');
const sql = require('sqlite3').verbose();
const db = require('../util/dbAsyncWrapper');
const dateRanker = require('./rankDates');

const crypto = require('crypto');
const ENCRYPTION_KEY = process.env.TOKEN_SECRET; // 32 bytes
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// User functions
// TODO make params not hardcoded
async function registerUser(fbID, username, email, password, salt, googleID){
    let lastID = await db.run(
        'INSERT INTO users (fb_id, google_id, username, email, password, salt) VALUES(?,?,?,?,?,?);', 
        [fbID, googleID, username, email, password, salt]
    );
    return await db.get('SELECT * FROM users WHERE uid = ?;', [lastID.lastID]);
}

async function getUserByUsername(username){
    let user = await db.get('SELECT * FROM users WHERE username = ?;', [username]);
    return user ?? null;
}

async function getUserByUID(uid){
    let user = await db.get('SELECT * FROM users WHERE uid = ?;', [uid]);
    return user ?? null;
}

async function getUserByFormbarID(fbID){
    let user = await db.get('SELECT * FROM users WHERE fb_id = ?;', [fbID]);
    return user ?? null;
}

async function getUserByEmail(email){
    let user = await db.get('SELECT * FROM users WHERE email = ?;', [email]);
    return user ?? null;
}

async function getUserByUsernameOrEmail(identifier){
    let user = await db.get('SELECT * FROM users WHERE username = ? OR email = ?;', [identifier, identifier]);
    return user ?? null;
}
// Notification functions
// Going to use this for almost all notifications
async function getNotificationsByUser(receivingUserUID){
    let notifications = await db.all('SELECT * FROM notifications WHERE receiving_user_uid = ?;', [receivingUserUID]);
    return notifications ?? null;
}

async function getNotificationByEvent(event){
    let notification = await db.get('SELECT * FROM notifications WHERE event = ?;', [event]);
    return notification ?? null;
}

async function getNotificationType(type){
    let notification = await db.get('SELECT * FROM notifications WHERE notif_type = ?;', [type]);
    return notification ?? null;
}

async function getNotificationsByUser(receivingUserUID) {
    let notifications = await db.all('SELECT * FROM notifications WHERE receiving_user_uid = ?;', [receivingUserUID]);
    return notifications ?? null;
}

module.exports = {
    registerUser,
    getUserByUID,
    getUserByFormbarID,
    getUserByUsernameOrEmail,
    getUserByEmail,
    getUserByUsername,
    getNotificationsByUser,
    getNotificationByEvent,
    getNotificationType,
    getNotificationsByUser
};