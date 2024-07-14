const jwt = require('jsonwebtoken');
const { updateDiary } = require('./updateDiary'); // updateDiary 함수 가져오기

module.exports = function updateDiaryAPI(req, res) {
    const token = req.headers.authorization; // 클라이언트가 보낸 JWT 토큰
    if (!token) {
        return res.status(401).send({ error: 'Authorization token not provided' });
    }

    // JWT를 해석하여 사용자 ID 추출
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Failed to authenticate token' });
        }

        const userId = decoded.user_id; // 추출한 사용자 ID

        // 수정할 일기의 ID와 새로운 내용을 요청에서 가져옵니다.
        const { diaryId, newDiaryText } = req.body;

        // updateDiary 함수를 사용하여 일기 수정
        updateDiary({ userId, diaryId, newDiaryText })
            .then(() => res.status(204).send())
            .catch(error => res.status(500).send({ error: error.message }));
    });
};