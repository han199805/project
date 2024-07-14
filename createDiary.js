const connection = require('./database'); // 데이터베이스 연결 설정 파일 import
const { sendDataToOpenAI, saveProcessedData } = require('./processData');

function createDiary({ userId, diaryText }) {
    return new Promise((resolve, reject) => {
        // 데이터베이스에 새로운 일기를 추가하는 SQL 쿼리
        const sql = `INSERT INTO diary (user_id, diary_text, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`;

        // SQL 쿼리 실행
        connection.query(sql, [userId, diaryText], async (error, results) => {
            if (error) {
                return reject(error);
            }
            const diaryId = results.insertId; // 새로 추가된 일기의 ID

            // 데이터 처리 함수 호출
            try {
                const processedText = await sendDataToOpenAI(diaryText);
                await saveProcessedData(diaryId, processedText);
                resolve(diaryId);
            } catch (error) {
                reject(error);
            }
        });
    });
}

module.exports = { createDiary };