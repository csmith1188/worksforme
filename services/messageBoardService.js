const path = require('path');
const sql = require('sqlite3').verbose();
const db = require('../util/dbAsyncWrapper');
const dateRanker = require('./rankDates');
const { AsyncResource } = require('async_hooks');

//gets all the message boards
async function getEventsMB() {
    const sql = 'SELECT * FROM eventsMB';
    return await db.all(sql);
}

async function getEventMBbyeventUID(eventUID) {
    const sql = 'SELECT * FROM eventsMB WHERE event_uid = ?';
    return await db.all(sql, [eventUID]);
}

async function createMB(uid, name, eventUID) {
    const sql = 'INSERT INTO eventsMB (uid, name, event_uid) VALUES (?, ?, ?)';
    const params = [uid, name, eventUID];
    return await db.run(sql, params);
}

async function getEventsMC() {
    const sql = 'SELECT * FROM eventsMC';
    return await db.all(sql);
    
}

async function getEventMCByUID(uid) {
    const sql = 'SELECT * FROM eventsMC WHERE uid = ?';
    return await db.get(sql, [uid]);
}

async function createMC(uid, name) {
    const sql = 'INSERT INTO eventsMC (uid, name) VALUES (?, ?)';
    const params = [uid, name];
    return await db.run(sql, params);
}


module.exports = {
    getEventsMB,
    getEventMBbyeventUID,
    createMB,
    getEventsMC,
    getEventMCByUID,
    createMC
};