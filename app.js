const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const morgan = require("morgan");

const { DataSource } = require("typeorm");

const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

const userServices = require("./services/userServices.js");

// 실행
app.get("/", userServices.welcome); // 메인홈
app.get("/users", userServices.getUsers); // 유저데이터 화면
app.post("/users", userServices.createUsers); // 회원가입
app.post("/login", userServices.login); //  로그인 - ing
// app.post("/posts", userPost.postDashboard); // 게시물 올리기
// app.get("/posts", userPost.getDashboard); // 게시물 보여주기
// app.put("/change", userServices.change); // 유저 회원정보 변경

const server = http.createServer(app);

const serverPort = 8000;

const start = async () => {
  try {
    server.listen(serverPort, () =>
      console.log(`Server is listening on ${serverPort}`)
    );
  } catch (err) {
    console.error(err);
  }
};

start();
