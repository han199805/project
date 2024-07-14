const connection = require('./database');

function getUserById(userId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE user_id = ?`;

        connection.query(sql, [userId], (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.length === 0) {
                return reject(new Error('User not found'));
            }
            resolve(results[0]);
        });
    });
}

// getUserByEmail 함수 추가
function getUserByEmail(userEmail) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE user_email = ?`;

        connection.query(sql, [userEmail], (error, results) => {
            if (error) {
                reject(error);
            } else if (results.length === 0) {
                reject(new Error('User not found'));
            } else {
                resolve(results[0]);
            }
        });
    });
}

module.exports = { getUserById, getUserByEmail };