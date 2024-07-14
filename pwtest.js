const bcrypt = require('bcrypt');

// 사용자가 로그인 폼에서 입력한 비밀번호
const inputPassword = '12345';
// 데이터베이스에서 검색된 사용자의 비밀번호 해시
const storedHash = '$2b$10$OaiLFvoOrZFKvj7Mij3wkOK4ZGeGv73lgAWVx2';

bcrypt.compare(inputPassword, storedHash, (err, isMatch) => {
    if (err) {
        console.error("Error during password comparison", err);
    } else if (isMatch) {
        console.log("Password matches!");
    } else {
        console.log("Password does not match.");
    }
});