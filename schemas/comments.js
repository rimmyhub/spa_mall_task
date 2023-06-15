const mongoose = require("mongoose"); //mongoose모듈을 가져옴

const commentsSchema = new mongoose.Schema({
  // Mongoose의 Schema 함수를 사용하여 "posts" 컬렉션의 스키마를 정의
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    // string으로 된 Id를 ObjectId 타입으로 변경
    required: true,
    //required는 해당 필드가 꼭 필요하다는 뜻
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // comment 데이터 생성시간을 저장
  },
});

module.exports = mongoose.model("Comments", commentsSchema);
// 정의한 스키마를 기반으로 "Posts"라는 모델을 생성하고 exports 내보냄
