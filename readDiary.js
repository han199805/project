// readDiary.js

const connection = require('./database');

function readDiary(diaryId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM diary WHERE diary_id = ?`;

        connection.query(sql, [diaryId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            }
        });
    });
}

module.exports = readDiary;