const mysql = require('mysql');
const connection = require('./database'); // 데이터베이스 연결 설정을 포함하는 파일

function createUser(userData) {
    return new Promise((resolve, reject) => {
        const { user_email, user_password, user_name, user_nickname } = userData;
        const sql = `INSERT INTO users (user_email, user_password, user_name, user_nickname) VALUES (?, ?, ?, ?)`;

        connection.query(sql, [user_email, user_password, user_name, user_nickname], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.insertId);
        });
    });
}

module.exports = { createUser };