const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

const { DataSource } = require("typeorm");
const { errorHandler } = require("../errorHandler.js");

const AppDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

// API

const createPosts = async (req, res) => {
  try {
    const { content } = req.body;

    console.log("req_body:", req.body);

    // 사용자 인증(토큰)  :  nickname
    // 인증 X  :  에러
    // 인증 O  :  다음
    // 에러핸들링 추가 필요  :  토큰 확인  -  1. 토큰이 없는 상황, 2. 우리가 발행한 토큰이 아닌 상황

    const inputToken = req.headers.authorization;
    const verifyToken = jwt.verify(inputToken, process.env.SECRETKEY);
    const { id, email, nickname } = verifyToken;

    errorHandler(!inputToken, "not exist token", 401);
    // if(!verifyToken) {
    //   const error = new Error("not exist token");
    //   error.statusCode = 400;
    //   throw error;
    // }

    const userCheck = await AppDataSource.query(`
    SELECT id FROM user WHERE email = "${email}"
    `);

    errorHandler(!userCheck[0].id === id, "not authorization token", 401);
    // if (!usercheck[0].id === id) {
    //   const error = new Error("not authoriaztion")
    //   error.statusCode = 401;
    //   throw error;
    // }

    // 글 저장(post)
    const newPost = await AppDataSource.query(`
        INSERT INTO post(content, nickname)
        VALUES("${content}", "${nickname}")
        `); // FK로 USER_ID

    console.log("newPost:", newPost);

    return res.status(201).json({
      message: "new post create complete",
    });
  } catch (err) {
    console.log(err);
  }
};

const getPost = async (req, res) => {
  try {
    // const { nickname, content } = req.body;
    const postList = await AppDataSource.query(`
    SELECT * FROM post ORDER BY created_at DESC`);

    res.status(200).json({
      postList: postList,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "check your input plz",
    });
  }
};
AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

module.exports = {
  createPosts,
  getPost,
};
