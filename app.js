const express = require('express');
const app = express();
const port = 3000;

const postsRouter = require("./routes/posts.js")
const commentsRouter = require("./routes/comments.js")
const connect = require("./schemas")
connect()

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
// localhost:3000/api
app.use("/api", [postsRouter, commentsRouter]);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
