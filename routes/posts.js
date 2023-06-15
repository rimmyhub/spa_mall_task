const express = require("express"); // express 모듈을 가져옴
const router = express.Router(); // 가져온 router(컴퓨팅 디바이스와 네트워크를 다른 네트워크에 연결하는 네트워킹 디바이스) 객체를 변수에 할당
const ObjectId = require("mongoose").Types.ObjectId;
// Mongoose 라이브러리에서 제공하는 ObjectId 타입을 사용하여 변수에 할당
// Tip! schemas의 id가 string으로 되어있으나 데이터베이스에 들어가고 나올때는 ObjectId 형태로 자동 변환 됨 (안되는 경우도 있음)
const Posts = require("../schemas/posts.js"); // Posts schema를 가져와 변수에 할당

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
]; // 테스트용, 임의로 만든 데이터 쓰이지 않으므로 삭제해도 됨


// 게시글 전체 조회
router.get("/posts", async (req, res) => {
  // get으로 데이터를 요청함 /posts 엔드포인트에 대한 핸들러 함수를 정의
  const data = await Posts.find({}).sort({ createdAt: -1 });
  // Posts 모델에서 모든 내용을 조회하고 createdAt 필드를 기준으로 내림차순으로 정렬
  res.status(200).json({ data });
  // 게시글이 있을 경우 200 상태 코드로 응답
});
// Tip! 일반적으로 핸들러 함수는 (req, res) 매개변수를 가짐, 이는 요청(request)과 응답(response) 객체를 나타냄.
// req 객체는 클라이언트의 요청에 대한 정보를 담고 있고, res 객체는 클라이언트에게 응답을 전송하는데 사용.


// 게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
  // get으로 데이터를 요청함
  const { postId } = req.params;
  // 라우팅 경로에서 동적 매개변수(:postId)를 추출하여 postId에 할당
  const postOid = new ObjectId(postId);
  // postId를 ObjectId로 변환하여 postOid 변수에 저장 (new: 새로운 객체 생성)
  const getPostById = await Posts.findOne({ _id: postOid });
  // Posts 모델을 사용하여 _id 필드가 postOid와 일치하는 포스트를 데이터베이스에서 조회하고 getPostById 변수에 저장

  if (!getPostById) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  } // 조회된 게시글이 없을 경우 데이터 형식이 올바르지 않다는 메세지와 함께 400 상태코드로 응답

  res.status(200).json({ data: getPostById });
  // 조회된 게시글이 있을 경우 200 상태 코드로 응답
});


//게시글 작성
router.post("/posts", async (req, res) => {
  // post로 데이터를 추가함
  const { user, password, title, content } = req.body;
  // body에서 user, password, title, content를 추출하여 각각의 변수에 할당
  const createdPosts = await Posts.create({ user, password, title, content }); //Posts 모델을 사용하여 user, password, title, content를 가진 새로운 게시글을 생성

  if (!user || !password || !title || !content) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  } // user, password, title, content 중 하나라도 존재하지 않는다면 데이터 형식이 올바르지 않다는 메세지와 함께 400 상태코드로 응답

  res
    .status(200)
    .json({ message: "게시글을 생성하였습니다.", data: createdPosts });
    // 게시글이 생성된 경우 게시글을 생성하였다는 메세지와 함께 작성된 게시글 데이터를 200 상태 코드로 응답
});


//게시글 수정
router.put("/posts/:postId", async (req, res) => {
  // put으로 데이터를 수정함
  const { postId } = req.params;
  // 라우팅 경로에서 동적 매개변수(:postId)를 추출하여 postId에 할당
  const { user, password, title, content } = req.body;
  // body에서 user, password, title, content를 추출하여 각각의 변수에 할당 
  const existsPosts = await Posts.findById(postId);
  // Posts 모델에서 postId에 해당하는 게시글을 조회하여 existsPosts 변수에 할당
  
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
      } // Posts 모델을 사용하여 postId에 해당하는 요소들을 주어진 변경 내용으로 업데이트 ($set이 변경하는 부분)
    );

    if (!user || !password || !title || !content) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    } // user, password, title, content 중 하나라도 존재하지 않는다면 데이터 형식이 올바르지 않다는 메세지와 함께 400 상태코드로 응답

    if (!existsPosts) {
      return res.status(404).json({ message: "게시글 조회에 실패했습니다." });
    } //게시글이 없을 경우 게시글 조회에 실패하였다는 메세지와 함께 404 상태코드로 응답
  }
  res
    .status(200)
    .json({ message: "게시글을 수정하였습니다.", data: existsPosts });
    // 게시글 수정이 완료된 경우 게시글을 수정하였다는 메세지와 함께 게시글 데이터를 200 상태 코드로 응답
});


//게시글 삭제
router.delete("/posts/:postId", async (req, res) => {
  // delete로 데이터를 제거함
  const { postId } = req.params;
  // 라우팅 경로에서 동적 매개변수(:postId)를 추출하여 postId에 할당
  const { password } = req.body;
  // body에서 password 추출하여 password 변수에 할당
  const existsPosts = await Posts.findById(postId);
  // Posts 모델에서 postId에 해당하는 게시글을 조회하여 existsComment 변수에 할당

  if (!password) {
    return res
      .status(404)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  } // password가 없다면 데이터 형식이 올바르지 않다는 메세지와 함께 404 상태 코드로 응답

  if (!existsPosts) {
    return res.status(404).json({ message: "게시글 조회에 실패했습니다." });
  } // Posts 모델에서 postId 해당하는 게시글이 없을때 게시글 조회에 실패했다는 메세지와 함께 404 상태 코드로 응답

  if (existsPosts.password !== password) {
    return res.status(400).json({ message: "비밀번호가 올바르지 않습니다." });
  } // postId에 해당하는 게시글 password와 요청의 password가 일치하지 않을 경우 비밀번호가 올바르지 않다는 메세지와 함께 400 상태 코드로 응답

  await Posts.deleteOne({ _id: postId });
  // Posts 모델에서 _id 필드와 postId와 일치하는 게시글을 삭제(deleteOne, 조건에 일치하는 단일 문서 삭제 메서드)

  res
    .status(200)
    .json({ message: "게시글을 삭제하였습니다.", data: existsPosts });
    // 게시글을 삭제한 경우 게시글을 삭제하였다는 메세지와 함께 삭제된 게시글 데이터를 200 상태 코드로 응답
});

module.exports = router;
// router 객체를 다른 모듈에서 사용할 수 있도록 exports 내보냄
