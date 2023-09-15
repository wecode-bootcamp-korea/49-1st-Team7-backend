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

const userServices = require("./services/userServices");
const postServices = require("./services/postServices");

const AppDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

const { errorHandler } = require("./errorHandler.js");

// 실행
app.get("/", userServices.welcome); // 메인홈
app.get("/users", userServices.getUsers); // 유저데이터 화면
app.post("/users", userServices.createUsers); // 회원가입

app.post("/login", userServices.login); //  로그인
app.post("/posts", postServices.createPosts); //  글 작성
app.get("/posts", postServices.getPost); // 글 목록



const server = http.createServer(app);

// const serverPort = 8000;

const start = async () => {
  try {
    server.listen(process.env.TYPEORM_SERVERPORT, () =>
      console.log(`Server is listening on `, process.env.TYPEORM_SERVERPORT)
    );
  } catch (err) {
    console.error(err);
  }
};


AppDataSource.initialize().then(() => {

  console.log("Data Source has been initialized!");
});

postServices.AppDataSource.initialize().then(() => {
  console.log("Post Source has been initialized!")
});


start();

module.exports = {
  AppDataSource,
};
