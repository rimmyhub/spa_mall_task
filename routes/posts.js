const express = require("express");
const router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const Posts = require("../schemas/posts.js");

const data = [
  {
    postId: "62d6d12cd88cadd496a9e54e",
    user: "Developer",
    title: "안녕하세요",
    createdAt: "2022-07-19T15:43:40.266Z",
  },
  {
    postId: "62d6cc66e28b7aff02e82954",
    user: "Developer",
    title: "안녕하세요",
    createdAt: "2022-07-19T15:23:18.433Z",
  },
];

// 게시글 목록 조회
router.get("/posts", async (req, res) => {
  const data = await Posts.find({});
  res.status(200).json({ data });
});

// 게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const postOid = new ObjectId(postId);
  const getPostById = await Posts.findOne({ _id: postOid });

  if (!getPostById) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  res.status(200).json({ data: getPostById });
});

//게시글 생성
router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;
  const createdPosts = await Posts.create({ user, password, title, content });

  if (!user || !password || !title || !content) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  res
    .status(200)
    .json({ message: "게시글을 생성하였습니다.", data: createdPosts });
});

//게시글 수정
router.put("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { user, password, title, content } = req.body;

  const existsPosts = await Posts.findById(postId);
  if (existsPosts) {
    await Posts.updateOne(
      { _id: postId },
      {
        $set: {
          user: user,
          password: password,
          title: title,
          content: content,
        },
      }
    );

    if (!user || !password || !title || !content) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    if (!existsPosts) {
      return res.status(404).json({ message: "게시글 조회에 실패했습니다." });
    }
  }
  res
    .status(200)
    .json({ message: "게시글을 수정하였습니다.", data: existsPosts });
});

//게시글 삭제
router.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;

  const existsPosts = await Posts.findById(postId);

  if (!password) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  if (!existsPosts) {
    return res.status(404).json({ message: "게시글 조회에 실패했습니다." });
  }

  if (existsPosts.password !== password) {
    return res.status(404).json({ message: "비밀번호가 올바르지 않습니다." });
  }

  await Posts.deleteOne({ _id: postId });

  res
    .status(200)
    .json({ message: "게시글을 삭제하였습니다.", data: existsPosts });
});

module.exports = router;
