const connection = require('./database');

function deleteUser(userId) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM users WHERE user_id = ?`;

        connection.query(sql, [userId], (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.affectedRows === 0) {
                return reject(new Error('User not found'));
            }
            resolve(results);
        });
    });
}

module.exports = { deleteUser };