const db = require('../util/dbAsyncWrapper');

async function addBoard(event, name) {
    const sql = 'INSERT INTO message_boards (event_uid, title) VALUES (?, ?)';
    return await db.run(sql, [event, name]);
}

module.exports = {
    addBoard
};