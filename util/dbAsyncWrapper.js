const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.DB_PATH || './database.db';
const db = new sqlite3.Database(dbPath);

function wrapDb(db) {
    return {
        run(sql, params = []) {
            return new Promise((resolve, reject) => {
                db.run(sql, params, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ lastID: this.lastID, changes: this.changes }); // Ensure lastID is returned
                    }
                });
            });
        },
        get(sql, params = []) {
            return new Promise((resolve, reject) => {
                db.get(sql, params, (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });
        },
        all(sql, params = []) {
            return new Promise((resolve, reject) => {
                db.all(sql, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        }
    };
}

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON;");
});

module.exports = wrapDb(db);