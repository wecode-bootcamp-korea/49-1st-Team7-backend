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
    const { content, nickname } = req.body;

    console.log("req_body:", req.body);

    // 사용자 인증  :  nickname
    // 인증 X  :  에러
    // 인증 O  :  다음

    const userCheck = await AppDataSource.query(`
    SELECT * FROM user WHERE nickname = "${nickname}"
    `);

    errorHandler(userCheck.length === 0, "not exist user", 400);
    // if (email === undefined || password === undefined) {
    //   const error = new Error("input error");
    //   error.statusCode = 400;
    //   throw error;
    // }

    // const userCheck = await AppDataSource.query(`
    //     SELECT * FROM users WHERE email = ${email} AND password = ${password}`);

    // if (userCheck === 0) {
    //   const error = new Error("plz check email or password");
    //   error.statusCode = 400;
    //   throw error;
    // }

    // 글 저장(post)
    const newPost = await AppDataSource.query(`
        INSERT INTO post(content, nickname)
        VALUES("${content}", "${nickname}")
        `);

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
    const { nickname, content } = req.body;
    const postList = await AppDataSource.query(`
    SELECT * FROM post ORDER BY created_at DESC`);

    res.status(200).json({
      "post list: ": postList,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "check your nickname plz",
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
