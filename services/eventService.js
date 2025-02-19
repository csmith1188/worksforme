const path = require('path');
const sql = require('sqlite3').verbose();
const db = require('../util/dbAsyncWrapper');

//db stuff here
async function changeEventName(){
    let aEvent = req.params.aEvent;
    let newEventName = req.body.newEventName;
    let sql = 'UPDATE events SET name = ? WHERE uid = ?';
    await db.run(sql, [newEventName, aEvent]);
    res.redirect(`/event/eventPage/${aEvent}`);
}

module.exports = {
    changeEventName
}