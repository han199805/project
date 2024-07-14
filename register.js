// register.js
const bcrypt = require('bcrypt');
const { createUser } = require('./create');

const saltRounds = 10;

function registerUser(userData) {
    return new Promise((resolve, reject) => {
        const { user_password, password_clarify } = userData;

        if (user_password !== password_clarify) {
            return reject(new Error("Passwords do not match."));
        }

        bcrypt.hash(user_password, saltRounds, function(err, hash) {
            if (err) reject(err);
            userData.user_password = hash; // 해시된 비밀번호로 교체
            // userData 객체에서 password_clarify 제거
            delete userData.password_clarify;
            createUser(userData)
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    });
}

module.exports = { registerUser };