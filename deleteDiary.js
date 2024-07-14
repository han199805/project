const deleteDiary = async (diaryId, connection) => {
    try {
        // 데이터베이스에서 해당 ID의 일기를 삭제하기 전에 해당 ID에 해당하는 모든 feel 테이블의 행을 삭제합니다.
        await connection.query("DELETE FROM feel WHERE diary_id = ?", [diaryId]);

        // 이제 데이터베이스에서 해당 ID의 일기를 삭제합니다.
        const result = await connection.query("DELETE FROM diary WHERE diary_id = ?", [diaryId]);
        return result.affectedRows > 0; // 삭제된 행이 있으면 true 반환
    } catch (error) {
        throw new Error(`Failed to delete diary: ${error.message}`);
    }
};

module.exports = { deleteDiary };