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

async function getEventMBByUID(uid) {
    const sql = 'SELECT * FROM eventsMB WHERE uid = ?';
    return await db.get(sql, [uid]);
}

async function createMB(uid, name) {
    const sql = 'INSERT INTO eventsMB (uid, name) VALUES (?, ?)';
    const params = [uid, name];
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
    getEventMBByUID,
    createMB,
    getEventsMC,
    getEventMCByUID,
    createMC
};