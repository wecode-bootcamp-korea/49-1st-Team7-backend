const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const { DataSource } = require("typeorm");

// const myDataSource = new DataSource({
//   type: process.env.TYPEORM_CONNECTION,
//   host: process.env.TYPEORM_HOST,
//   port: process.env.TYPEORM_PORT,
//   username: process.env.TYPEORM_USERNAME,
//   password: process.env.TYPEORM_PASSWORD,
//   database: process.env.TYPEORM_DATABASE,
// });

const myDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: "3306",
  username: "root",
  password: "pw",
  database: "minitest",
});

// API

const welcome = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Hello, welcome to 7Team's Server!!",
    });
  } catch (err) {
    console.log(err);
  }
};

const getUsers = async (req, res) => {
  try {
    const userData = await myDataSource.query(`
        SELECT id, email, password FROM users`);

    return res.status(200).json({
      users: userData,
    });
  } catch (err) {
    console.log(err);
  }
};

const createUsers = async (req, res) => {
  try {
    const { body } = req;
    const { name, email, password } = body;

    if (name === undefined || email === undefined || password === undefined) {
      const error = new Error("input error");
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 8) {
      const error = new Error("input password is too short");
      error.statusCode = 400;
      throw error;
    }

    if (!email.includes("@") && !email.includes(".")) {
      const error = new Error("@ or . is not input in email");
      error.statusCode = 400;
      throw error;
    }

    const emailCheck = await myDataSource.query(`
          SELECT name, email, password FROM users WHERE email="${email}"
          `);

    //이메일중복  /  ID중복
    if (emailCheck.length > 0) {
      const error = new Error("already exist email");
      error.statusCode = 400;
      throw error;
    }

    const userData = await myDataSource.query(`
      INSERT INTO users(name, email, password)
      VALUES("${name}", "${email}", "${password}")
      `);

    console.log("create new user data : ", userData);

    return res.status(201).json({
      message: "user create complete!",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "error! check your input, plz",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (password.length < 8) {
      const error = new Error("input password is too short");
      error.statusCode = 400;
      throw error;
    }

    const userCheck = await myDataSource.query(`
      SELECT * FROM users WHERE email = "${email}" AND password = "${password}"
      `);

    console.log(userCheck);

    if (userCheck.length === 0) {
      const error = new Error("check your EMAIL or PW plz");
      error.statusCode = 400;
      throw error;
    }

    const loginToken = jwt.sign({ id: userCheck[0].id }, "loginToken");

    return res.status(200).json({
      message: "login complete",
      token: loginToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "login failed, check your EMAIL or PW plz",
    });
  }
};

module.exports = {
  welcome: welcome, //  키, 밸류값이 같으면 하나만 넣어도 된다.  =  welcome만
  getUsers: getUsers,
  createUsers: createUsers,
  login: login,
  myDataSource: myDataSource,
};

// welcome
// getUsers
// createUsers
// login
