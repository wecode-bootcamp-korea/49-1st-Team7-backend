const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")


const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  serverport : process.env.TYPEORM_SERVERPORT,
  token : process.env.TYPEORM_JWT,
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
    const userData = await AppDataSource.query(`
        SELECT nickname, email, password FROM user`);

    return res.status(200).json({
      users: userData
    });
  } catch (err) {
    console.log(err);
  }
};


const createUsers = async (req, res) => {
  try {
    const { body } = req;
    const { nickname, email, password } = body;
    const salt = 12

    const makeHash = await bcrypt.hash(req.body.password, salt)
    console.log("확인", makeHash)


    if (nickname === undefined || email === undefined || password === undefined) {
      const error = new Error("input error");
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 10) {
      const error = new Error("input password is too short");
      error.statusCode = 400;
      throw error;
    }

    if (!email.includes("@") && !email.includes(".")) {
      const error = new Error("@ or . is not input in email");
      error.statusCode = 400;
      throw error;
    }
    
    const emailCheck = await AppDataSource.query(`
          SELECT nickname, email, password FROM user WHERE email="${email}"
          `);

    //이메일중복  /  ID중복
    if (emailCheck.length > 0) {
      const error = new Error("already exist email");
      error.statusCode = 400;
      throw error;
    }

    const userData = await AppDataSource.query(`
      INSERT INTO user(nickname, email, password)
      VALUES("${nickname}", "${email}", "${makeHash}")
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

    if (password.length < 10) {
      const error = new Error("input password is too short");
      error.statusCode = 400;
      throw error;
    }

    const userCheck = await AppDataSource.query(`
      SELECT id, email, password, nickname FROM user WHERE email = "${email}"
      `);

    
    if (userCheck.length === 0) {
      // 사용자를 찾을 수 없을 경우 에러 처리
      const error = new Error("Check your EMAIL or PW plz");
      error.statusCode = 400;
      throw error;
    }
    console.log(userCheck);

    const hashedPassword = userCheck[0].password
    const checkPassword = await bcrypt.compare(password, hashedPassword)
    console.log(checkPassword)

    if(!checkPassword) {
      const error = new Error("Check your EMAIL or PW plz")
      error.statusCode = 400;
      throw error;
    }

    const loginToken = jwt.sign({ nickname: userCheck[0].nickname }, process.env.TYPEORM_JWT);

    return res.status(200).json({
      message: "login complete",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "login failed, check your EMAIL or PW plz",
    });
  }
};


// const addPost = async (req, res) => {
//   try {
//     const {content} = req.body

//     const postToken = req.headers.authorization;

//     if(!postToken) {
//       const error = new Error("TOKEN_ERROR")
//       error.statusCode = 400
//       error.code = "TOKEN_ERROR"
//       throw error
//     }
  
//     const {nickname} = jwt.verify(postToken, process.env.TYPEORM_JWT)
    
//     const postData = await AppDataSource.query(`
//     INSERT INTO post (
//       nickname,
//       content
//     ) VALUES (
//       '${nickname}',
//       '${content}'
//     )
//     `)

//     const checkName = await AppDataSource.query(`
//     SELECT nickname FROM user WHERE nickname = "${nickname}"
//     `);


//     if(nickname != checkName[0].nickname){
//       const error = new Error("Check your NAME")
//       error.statusCode = 400;
//       throw error;
//     }
//     return res.status(201).json({
//       "message" : "add Post!"
//     })
//   } catch (error) {
//     console.log(error)
//   }
// }

//   const showPost = async(req, res) => {
//     try {
//       const postData = await AppDataSource.query(`
//       SELECT 
//       nickname,
//       content AS postContent, 
//       created_at,
//       updated_at
//       FROM post
//       ORDER BY postId DESC;
//       `)
//       return res.status(200).json({
//         "postData" : postData
//       })
//     } catch (error) {
//       console.log(error)
//     }
//   }

module.exports = {
  welcome: welcome, //  키, 밸류값이 같으면 하나만 넣어도 된다.  =  welcome만
  getUsers: getUsers,
  createUsers: createUsers,
  login: login,
  AppDataSource: AppDataSource
};

// welcome
// getUsers
// createUsers
// login
