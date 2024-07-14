const connection = require('./database');

function updateUser(userId, userData) {
    return new Promise((resolve, reject) => {
        let fields = [];
        let values = [];

        // 요청된 각 필드를 검사하여 변경할 필드 목록을 생성
        Object.keys(userData).forEach(key => {
            if (userData[key] !== undefined && userData[key] !== "") { // 빈 값은 무시
                fields.push(`${key} = ?`);
                values.push(userData[key]);
            }
        });

        if (fields.length === 0) {
            reject(new Error("No data provided for update"));
            return;
        }

        const sql = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;
        values.push(userId); // 쿼리 매개변수의 마지막에 user_id 추가

        connection.query(sql, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.affectedRows === 0) {
                return reject(new Error('User not found or no change made'));
            }
            resolve(results);
        });
    });
}

module.exports = { updateUser };