---
id: 001
title: REST API와 Express.js 기본 개념 정리
category: SERVER
date: 2025-07-29
---

# REST API와 Express.js 기본 개념 정리

## ✅ REST API란?

REST(Representational State Transfer)는 웹 상에서 자원을 정의하고 자원에 대한 주소를 지정하는 방법론이다.  
RESTful API는 다음과 같은 특징을 갖는다:

- **자원(Resource)**: URI로 표현  
- **행위(Verb)**: HTTP Method (GET, POST, PUT, DELETE 등)  
- **표현(Representation)**: JSON, XML 등

| HTTP Method | 설명           |
|-------------|----------------|
| GET         | 자원 조회      |
| POST        | 자원 생성      |
| PUT         | 자원 전체 수정 |
| PATCH       | 자원 부분 수정 |
| DELETE      | 자원 삭제      |

---

## ✅ Express.js란?

Node.js에서 서버를 만들 때 가장 많이 사용하는 프레임워크.

### 주요 특징:

- 라우팅 기능
- 미들웨어 기능 지원
- 다양한 플러그인과 확장 가능

```js
// 간단한 Express 서버 예시
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, REST API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
