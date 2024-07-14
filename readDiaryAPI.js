const jwt = require('jsonwebtoken');
const { getDiaryById } = require('./readDiary'); // getDiaryById 함수 가져오기

module.exports = function readDiaryAPI(req, res) {
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

        // 조회할 일기의 ID를 요청에서 가져옵니다.
        const diaryId = req.params.diaryId;

        // getDiaryById 함수를 사용하여 일기 조회
        getDiaryById({ userId, diaryId })
            .then(diary => res.status(200).send(diary))
            .catch(error => res.status(500).send({ error: error.message }));
    });
};