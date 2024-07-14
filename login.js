const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getUserByEmail } = require('./read'); // 사용자 이메일로 사용자 정보를 가져오는 함수

const secretKey = process.env.JWT_SECRET_KEY; //  JWT를 위한 비밀키

function loginUser(userData) {
    return new Promise((resolve, reject) => {
        getUserByEmail(userData.user_email).then(user => {
            if (!user) {
                reject(new Error("User not found"));
                return;
            }
            bcrypt.compare(userData.user_password, user.user_password, (err, isMatch) => {
                if (err) {
                    reject(err);
                } else if (!isMatch) {
                    console.log(userData.user_password);
                    console.log(user.user_password);
                    reject(new Error("Password does not match"));
                } else {
                    // 비밀번호가 일치하면 JWT 발급
                    const token = jwt.sign({
                        id: user.user_id,
                        email: user.user_email
                    }, secretKey, { expiresIn: '3h' }); // 유효 시간은 3시간

                    console.log('Generated JWT:', token); // 발급된 JWT를 콘솔에 출력

                    resolve(token);
                }
            });
        }).catch(error => reject(error));
    });
}

module.exports = { loginUser };