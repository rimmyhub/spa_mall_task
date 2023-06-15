const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    user: {
      type: String,
      required: true,
    },
    password: {
        type: String,
        required: true,
      },
    title: {
      type: String,
      required: true,
    },
    content: {
        type: String,
        required: true,
    }
  });


module.exports = mongoose.model("Posts", postsSchema); //컬렉션 명, 스키마의 값 추가