const express = require("express");
const app = express();
const port = 3000;

const goodsRouter = require("./routes/goods.js");
const cartsRouter = require("./routes/carts.js")
const connect = require("./schemas");
connect();

app.use(express.json());
app.use("/api", [goodsRouter, cartsRouter]);

app.post("/", (req, res) => {
  console.log("req.body");

  res.send("기본 Url에 post 메소드가 정상적으로 실행되었습니다.");
});

// app.get("/", (req, res) => {
//   console.log(req.query);

//   const obj = {
//     "keykey" : "value 입니다",
//     "이름입니다" : "이름일까요?",
//   }

//   res.json(obj);
// });

//키값이 id로 변환된다
// app.get("/:id", (req, res) => {
//   console.log(req.params);

//   res.send(":id url에 정상적으로 반환되었습니다");
// }); //{ id: 'helloworld' }

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//api 등록하기
// localhost:3000/api -> goodesRoter
// app.use("/api", [goodsRouter]);
//배열로도 쓸 수 있음 app.use("/api", [goodsRouter,userRouter]);

// app.listen(port, () => {
//   console.log(`http://localhost:${port}`);
// });

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
