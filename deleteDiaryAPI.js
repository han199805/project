const jwt = require('jsonwebtoken');
const { deleteDiary } = require('./deleteDiary'); // deleteDiary 함수 가져오기
const connection = require('./database');

module.exports = function deleteDiaryAPI(req, res) {
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

        // 삭제할 일기의 ID를 요청에서 가져옵니다.
        const diaryId = req.params.diaryId;

        // deleteDiary 함수를 사용하여 일기 삭제 (DB 연결 전달)
        deleteDiary(diaryId, connection)
            .then((result) => {
                // 처리 결과에 따른 응답 전송
                if (result) {
                    res.status(200).send({ message: 'Diary deleted successfully' });
                } else {
                    res.status(404).send({ error: 'Diary not found' });
                }
            })
            .catch((error) => {
                res.status(500).send({ error: error.message });
            });
    });
};