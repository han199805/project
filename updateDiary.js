// updateDiary.js

const connection = require('./database');

function updateDiary(diaryId, updatedText) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE diary SET diary_text = ? WHERE diary_id = ?`;

        connection.query(sql, [updatedText, diaryId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.affectedRows > 0);
            }
        });
    });
}

module.exports = updateDiary;