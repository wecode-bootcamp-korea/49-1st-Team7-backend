// const http = require("http");
// const express = require("express");

const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { DataSource } = require("typeorm");
// const app = express();

const AppDataSource = new DataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// app.use(express.json()); // for parsing application/json

//1. API 로 users 화면에 보여주기

const getUsers = async (req, res) => {
  try {
    console.log("AppDataSource", AppDataSource);
    const userData = await AppDataSource.query(`
    SELECT id, nickname, email, password, profileImage, birthday, phoneNumber FROM user;
  `);
    console.log("USER DATA :", userData);

    return res.status(200).json({
      users: userData,
    });
  } catch (err) {
    console.log(err);
  }
};

//2. users 생성

const createUsers = async (req, res) => {
  try {
    const { body } = req;
    const { nickname, email, password, phoneNumber, birthday } = body;

    const salt = 12;
    const makeHash = await bcrypt.hash(password, salt);

    if (!nickname || !email || !password) {
      const error = new Error("input error");
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 8) {
      const error = new Error("input password is too short");
      error.statusCode = 400;
      throw error;
    }
    const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
    if (!regExp.test(password)) {
      const error = new Error("noRegExp");
      error.statusCode = 400;
      throw error;
    }

    if (
      !email.includes("@") &&
      !email.includes(".") &&
      (!email.includes("com") ||
        !email.includes("net") ||
        !email.includes("co.kr"))
    ) {
      const error = new Error("@ or . is not input in email");
      error.statusCode = 400;
      throw error;
    }

    const emailCheck = await AppDataSource.query(`
    SELECT nickname, email, password FROM user WHERE email="${email}"
    `);

    if (emailCheck.length > 0) {
      const error = new Error("already exist email");
      error.statusCode = 400;
      throw error;
    }

    const userData = await AppDataSource.query(`
      INSERT INTO user(nickname, email, password)
      VALUES("${nickname}", "${email}", "${password}" )
      `);

    console.log("create new user data : ", userData);

    return res.status(201).json({
      message: "user create complete!",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "User registration failed",
    });
  }
};

const welcome = async (req, res) => {
  try {
    return res.status(200).json({ message: "Welcome to 7team's server!" });
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await myDataSource.query(
      `SELECT id, email FROM user WHERE email='${email}';
      `
    );

    if (existingUser !== email) {
      // existing user 이용해서 판별` 동일하지 않으면 그냥 진행
      const error = new Error("DUPLICATED_EMAIL_ADDRESS");
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 8) {
      const error = new Error("input password is too short");
      error.statusCode = 400;
      throw error;
    }

    const userCheck = await AppDataSource.query(`
      SELECT * FROM user WHERE email = "${email}" AND password = "${makeHash}"
      `);

    console.log(userCheck);

    if (userCheck.length === 0) {
      const error = new Error("check your EMAIL or PW plz");
      error.statusCode = 400;
      throw error;
    }
    const hashedPassword = userCheck[0].password;
    const checkPassword = await bcrypt.compare(password, hashedPassword);

    const secretKey = "scretkey";
    const payload = id;

    const generateToken = (payload) => {
      try {
        const token = jwt.sign(payload, secretKey);
        return token;
      } catch (error) {
        throw new Error("토큰 생성에 실패했습니다.");
      }
    };

    // 1. generateToken() 함수 실행 결과를 먼저 콘솔에 찍어보기
    // 2. 콘솔에 토큰이 잘 나오면, accessToken 을 response로 프론트에 반환
    res.status(200).json({
      message: "LOGIN_SUCCESS",
      accessToken: generateToken(payload, expiresIn),
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "login failed, check your EMAIL or PW plz",
    });
  }
};

AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

module.exports = {
  welcome, //  키, 밸류값이 같으면 하나만 넣어도 된다.  =  welcome만
  getUsers,
  createUsers,
  login,
  AppDataSource,
};
