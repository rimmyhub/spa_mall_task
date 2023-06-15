const express = require("express"); // express 모듈을 가져옴
const router = express.Router(); // 가져온 router(컴퓨팅 디바이스와 네트워크를 다른 네트워크에 연결하는 네트워킹 디바이스) 객체를 변수에 할당
const Comments = require("../schemas/comments.js"); // comments schema를 가져와 변수에 할당


// 댓글 조회
router.get("/comments/:postId", async (req, res) => {
  // get으로 데이터를 요청함
  const { postId } = req.params;
  // 라우팅 경로에서 동적 매개변수(:postId)를 추출하여 postId에 할당
  const data = await Comments.find({ postId }).sort({ createdAt: -1 });
  //Comments 모델에서 postId와 일치하는 댓글을 찾고 createdAt 필드를 기준으로 내림차순으로 정렬

  if (!data) {
    return res.status(400).json({ message: "댓글이 존재하지 않습니다." });
  } // 조회된 댓글이 없을 경우 댓글이 존재하지 않다는 메세지와 함께 400 상태코드로 응답

  res.status(200).json({ data });
  // 댓글이 있을 경우 200 상태 코드로 응답
});


// 댓글 작성
router.post("/comments/:postId", async (req, res) => {
  // post로 데이터를 추가함
  const { user, password, content } = req.body;
  // body에서 user, password, content를 추출하여 각각의 변수에 할당
  const { postId } = req.params;
  // 라우팅 경로에서 동적 매개변수(:postId)를 추출하여 postId에 할당
  const createdComment = await Comments.create({
    postId,
    user,
    password,
    content,
  });
  //Comments 모델을 사용하여 postId, user, password, content를 가진 새로운 댓글을 생성

  if (!createdComment) {
    return res.status(400).json({
      success: false,
      message: "데이터 형식이 올바르지 않습니다.",
    }); //생성된 댓글이 없을 경우 데이터 형식이 올바르지 않다는 메세지와 함께 400 상태코드로 응답
  }

  res
    .status(200)
    .json({ message: "댓글을 생성하였습니다.", data: createdComment });
}); // 댓글이 생성된 경우 댓글을 생성하였다는 메세지와 함께 작성된 댓글 데이터를 200 상태 코드로 응답


//댓글 수정
router.put("/comments/:commentId", async (req, res) => {
  // put으로 데이터를 수정함
  const { commentId } = req.params;
  // 라우팅 경로에서 동적 매개변수(:commentId)를 추출하여 commentId에 할당
  const { password, content } = req.body;
  // body에서 password, content를 추출하여 content 변수에 할당
  const existsComment = await Comments.findById(commentId);
  // Comments 모델에서 commentId에 해당하는 댓글을 조회하여 existsComment 변수에 할당

  if (!content) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  } //댓글의 내용이 없을 경우 댓글 내용을 입력해 달라는 메세지와 함께 400 상태코드로 응답

  if (!existsComment) {
    return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  } //댓글이 없을 경우 댓글 조회에 실패하였다는 메세지와 함께 404 상태코드로 응답

  await Comments.updateOne(
    { _id: commentId }, 
    { 
      $set: { 
      password: password,
      content: content,
     } // Comments 모델을 사용하여 commentId에 해당하는 댓글의 password와 content를 주어진 변경 내용으로 업데이트 ($set이 변경하는 부분)
  });

  res
    .status(200)
    .json({ message: "댓글을 수정하였습니다.", data: existsComment });
    // 댓글 수정이 완료된 경우 댓글을 수정하였다는 메세지와 함께 댓글 데이터를 200 상태 코드로 응답
});


//댓글 삭제
router.delete("/comments/:commentId", async (req, res) => {
  // delete로 데이터를 제거함
  const { commentId } = req.params;
  // 라우팅 경로에서 동적 매개변수(:commentId)를 추출하여 commentId에 할당
  const { password } = req.body;
  // body에서 password 추출하여 password 변수에 할당
  const existsComments = await Comments.findById(commentId);
  // Comments 모델에서 commentId에 해당하는 댓글을 조회하여 existsComment 변수에 할당
  
  if (existsComments.password !== password) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  } // commentId에 해당하는 댓글 password와 요청의 password가 일치하지 않을 경우 데이터 형식이 올바르지 않다는 메세지와 함께 400 상태 코드로 응답

  if (!existsComments) {
    return res.status(404).json({ message: "삭제할 댓글을 찾을 수 없습니다." });
  } // Comments 모델에서 commentId에 해당하는 댓글이 없을때 삭제할 댓글을 찾을 수 없다는 메세지와 함께 404 상태 코드로 응답

  if (existsComments.password === password) {
    await Comments.deleteOne({ _id: commentId });
  } // commentId에 해당하는 댓글 password와 요청의 password가 일치하는 경우 해당 댓글을 삭제
  // Comments 모델에서 _id 필드와 commentId와 일치하는 댓글을 삭제(deleteOne, 조건에 일치하는 단일 문서 삭제 메서드)

  res
    .status(200)
    .json({ message: "댓글을 삭제하였습니다.", data: existsComments });
    // 댓글을 삭제한 경우 댓글을 삭제하였다는 메세지와 함께 삭제된 댓글 데이터를 200 상태 코드로 응답
});

module.exports = router;
// router 객체를 다른 모듈에서 사용할 수 있도록 exports 내보냄
