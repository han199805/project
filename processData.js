// processData.js

const pool = require("./database");
const openaiAPI = require("./openai");

async function fetchData() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT diary_text, diary_id FROM diary", (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
}

async function sendDataToOpenAI(data) {
  try {
    const response = await openaiAPI.post("/chat/completions", {
      model: "ft:gpt-3.5-turbo-0125:personal:feel:9CPu4Gcd",
      messages: [
        {
          role: "system",
          content:
            "다음 문장의 감정을 분석해줘, 답변은 기쁨, 분노, 혐오, 슬픔, 두려움 중에서만 해야해. 그 외 답변이 나오면 다시 생각해보세요:",
        },
        { role: "user", content: data },
      ],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "OpenAi call failed:",
      error.response ? error.response.data : error.message
    );
    throw new Error(`API call has failed: ${error.message}`);
  }
}

async function saveProcessedData(diaryId, processedText) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO feel (diary_id, feeling) VALUES (?, ?)",
      [diaryId, processedText],
      (error, results) => {
        if (error) reject(error);
        else resolve(results);
      }
    );
  });
}

async function processAndStoreDiaries() {
  const diaries = await fetchData();

  for (let diary of diaries) {
    const processedText = await sendDataToOpenAI(diary.diary_text);
    await saveProcessedData(diary.diary_id, processedText);
  }
}

processAndStoreDiaries().catch(console.error);

// Exporting the processAndStoreDiaries function for external use
module.exports = { processAndStoreDiaries,sendDataToOpenAI,saveProcessedData };