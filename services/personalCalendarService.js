const path = require('path');
const sql = require('sqlite3').verbose();
const db = require('../util/dbAsyncWrapper');

async function getUserCalendar(userUID){
    let dates = await db.all('SELECT * FROM calendar_dates WHERE user_uid = ?;', [userUID]);
    let datesMap = new Map();

    dates.forEach(date => {
        const newBusyTime = {
            uid: date.uid,
            start: date.start_time,
            end: date.end_time
        };

        if (datesMap.has(date.date)) {
            datesMap.get(date.date).push(newBusyTime);
        } else {
            datesMap.set(date.date, [newBusyTime]);
        }

    });

    return datesMap;
};

async function saveUserCalendar(userUID, createdBlocks, editedBlocks, deletedBlockUIDs){
    
    for (const block of createdBlocks) {
        await db.run('INSERT INTO calendar_dates (user_uid, date, start_time, end_time) VALUES (?, ?, ?, ?);', [userUID, block.date, block.start, block.end]);
    }

    for (const block of editedBlocks) {
        await db.run('UPDATE calendar_dates SET date = ?, start_time = ?, end_time = ? WHERE uid = ?;', [block.date, block.start, block.end, block.uid]);
    }

    for (const uid of deletedBlockUIDs) {
        await db.run('DELETE FROM calendar_dates WHERE uid = ?;', [uid]);
    }


}

module.exports = {
    getUserCalendar,
    saveUserCalendar
}