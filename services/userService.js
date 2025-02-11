const path = require('path');
const sql = require('sqlite3').verbose();
const db = require('../util/dbAsyncWrapper');
const dateRanker = require('./rankDates');

async function registerUser(fbID, username, password, salt){
    let lastID = await db.run('INSERT INTO users (fb_id, username, password, salt) VALUES(?,?,?,?);', [fbID, username, password, salt]);
    return lastID;
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

module.exports = {
    registerUser,
    getUserByUID,
    getUserByFormbarID,
    getUserByUsername,
    getUserByEmail
}