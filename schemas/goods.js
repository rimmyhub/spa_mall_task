const mongoose = require("mongoose");

const goodsSchema = new mongoose.Schema({
  goodsId: {
    type: Number, //타입 정하기 오브젝트스트링 등등
    required: true, // 무조건 값이 있어야설정 가능
    unique: true, // 고유한 아이디인가
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  thumbnailUrl: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
  },
});

module.exports = mongoose.model("Goods", goodsSchema);
