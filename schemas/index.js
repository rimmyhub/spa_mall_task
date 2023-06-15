const mongoose = require("mongoose"); //mongoose모듈을 가져옴

const connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/spa_mall_task")
    .catch(err => console.log(err));
};
// 로컬 MongoDB 서버의 기본 포트(27017)에 위치한 spa_mall_task라는 데이터베이스에 연결

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});
// 연결 도중 발생한 오류를 콘솔에 출력하는 부분, mongoose.connect가 실패하면 발생하는 오류를 캐치하여 err을 출력.

module.exports = connect;
// connect 함수를 다른 모듈에서 사용할 수 있도록 exports 내보냄
