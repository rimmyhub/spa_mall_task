const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comments.js");

// 댓글 목록 조회
router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  const data = await Comments.find({ postId });

  if (!data) {
    return res
      .status(400)
      .json({ message: "댓글이 존재하지 않습니다." });
  }

  res.status(200).json({ data });
});

// 댓글 생성
router.post("/comments/:postId", async (req, res) => {
  const { user, password, content } = req.body;
  const { postId } = req.params;
  const createdComment = await Comments.create({
    postId,
    user,
    password,
    content,
  });

  if (!createdComment) {
    return res.status(400).json({
      success: false,
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
  res
    .status(200)
    .json({ message: "댓글을 생성하였습니다.", data: createdComment });
});

//댓글 수정
router.put("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const existsComment = await Comments.findById(commentId);

  if (!content) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  }
  if (!existsComment) {
    return res
      .status(404)
      .json({ message: "댓글 조회에 실패하였습니다." });
  }

  await Comments.updateOne({ _id: commentId }, { $set: { content: content } });

  res
    .status(200)
    .json({ message: "댓글을 수정하였습니다.", data: existsComment });
});

//댓글 삭제
router.delete("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { password } = req.body;
  const existsComments = await Comments.findById(commentId);

  if (existsComments.password !== password) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  if (!existsComments) {
    return res.status(404).json({ message: "삭제할 댓글을 찾을 수 없습니다." });
  }

  if (existsComments.password === password) {
    await Comments.deleteOne({ _id: commentId });
  }

  res.status(200).json({ message: "게시글을 삭제하였습니다.", data: existsComments });
});

module.exports = router;