const express = require('express');
const bodyParser = require('body-parser');
const { getUserById } = require('./read');
const { updateUser } = require('./update');
const { deleteUser } = require('./delete');
const { registerUser } = require('./register');
const { loginUser } = require('./login');
const { createDiary } = require('./createDiary'); // createDiary 함수 가져오기
const deleteDiaryAPI = require('./deleteDiaryAPI'); // deleteDiary API 가져오기
const updateDiaryAPI = require('./updateDiaryAPI'); // updateDiary API 가져오기
const readDiaryAPI = require('./readDiaryAPI'); // readDiary API 가져오기
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// 사용자 생성
app.post('/register', (req, res) => {
    registerUser(req.body)
        .then(user => res.status(201).send({ message: 'User registered successfully', userId: user }))
        .catch(error => res.status(500).send({ error: error.message }));
});

// 사용자 정보 조회
app.get('/users/:id', (req, res) => {
  getUserById(req.params.id).then(user => {
    res.send(user);
  }).catch(error => {
    res.status(404).send(error.message);
  });
});

// 사용자 정보 업데이트
app.put('/users/:id', (req, res) => {
  updateUser(req.params.id, req.body).then(user => {
    res.send(user);
  }).catch(error => {
  res.status(500).send(error.message);
  });
});

// 사용자 삭제
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  // 사용자 삭제
  deleteUser(userId)
    .then(() => {
      // 사용자가 삭제되면 해당 사용자의 일기도 삭제
      deleteDiaryByUserId(userId)
        .then(() => {
          // 모든 작업이 성공적으로 완료되면 204 상태 코드 반환
          res.sendStatus(204);
        })
        .catch(error => {
          // 일기 삭제 중 오류 발생 시 500 상태 코드 반환
          res.status(500).send({ error: 'Failed to delete user diaries' });
        });
    })
    .catch(error => {
      // 사용자 삭제 중 오류 발생 시 500 상태 코드 반환
      res.status(500).send({ error: error.message });
    });
});
//로그인
app.post('/login', (req, res) => {
    loginUser(req.body)
        .then(token => res.send({ token }))
        .catch(error => res.status(401).send({ error: error.message }));
});

// 일기 생성
app.post('/diaries', async (req, res) => {
    const token = req.headers.authorization; // 클라이언트가 보낸 JWT 토큰
    if (!token) {
        return res.status(401).send({ error: 'Authorization token not provided' });
    }

    // JWT를 해석하여 사용자 ID 추출
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Failed to authenticate token' });
        }

        const userId = decoded.user_id; // 추출한 사용자 ID
        const diaryText = req.body.diary_text; // 클라이언트가 보낸 일기 텍스트

        try {
            // createDiary 함수를 사용하여 일기 생성
            const diaryId = await createDiary({ userId, diaryText });
            res.status(201).send({ message: 'Diary created successfully', diaryId });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });
});


// 일기 삭제
app.delete('/diaries/:diaryId', deleteDiaryAPI); // deleteDiary API를 사용하여 일기 삭제

// 일기 수정
app.put('/diaries/:diaryId', updateDiaryAPI);

// 일기 조회
app.get('/diaries/:diaryId', readDiaryAPI);

app.listen(3000, () => {
  console.log("server is running");
});