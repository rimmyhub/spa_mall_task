const express = require("express"); // express 모듈을 가져옴
const app = express(); // 가져온 express 모듈을 app객체 생성
const port = 3000; // 사용할 포트 번호인 3000을 변수 port에 선언

const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");
// 각각의 route 파일에서 가져온 모듈을 선언
const connect = require("./schemas");
connect(); // schemas에서 connect 함수를 가져와 데이터베이스 연결

app.get("/", (req, res) => {
  res.send("Hello World!");
}); // 확인용, app 객체의 GET 메서드를 사용하여 루트 경로('/')에 대한 요청의 응답으로 'Hello World!'보냄

app.use(express.json());
// 미들웨어를 사용하여 JSON 형식의 요청 본문을 파싱할 수 있도록 설정
// Tip! 미들웨어란 소프트웨어 시스템에서 서로 다른 컴포넌트나 시스템 간의 통신과 데이터 처리를 중간에서 처리하는 소프트웨어 구성 요소
app.use("/", [postsRouter, commentsRouter]);
// app 객체의 use 메서드를 사용, postsRouter와 commentsRouter를 미들웨어로 등록
// 이렇게 등록된 라우터는 해당 경로에 대한 요청에 대해 처리를 담당

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
}); // app 객체의 listen 메서드를 사용, 지정된 포트(port)에서 서버를 시작. 서버가 열리면 콘솔에 포트 번호와 "포트로 서버가 열렸어요!" 메시지가 출력
