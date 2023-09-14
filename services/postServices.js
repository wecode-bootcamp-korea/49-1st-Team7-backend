const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");


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

const addPost = async (req, res) => {
    try {
      const {content} = req.body
  
      const postToken = req.headers.authorization;
  
      if(!postToken) {
        const error = new Error("TOKEN_ERROR")
        error.statusCode = 400
        error.code = "TOKEN_ERROR"
        throw error
      }
    
      const {nickname} = jwt.verify(postToken, process.env.TYPEORM_JWT)
      

      if(content.length === 0) {
        const error = new Error("CONTENT_TOO_SHORT")
        error.statusCode = 400
        throw error
      }


      const postData = await AppDataSource.query(`
      INSERT INTO post (
        nickname,
        content
      ) VALUES (
        '${nickname}',
        '${content}'
      )
      `)
  
      const checkName = await AppDataSource.query(`
      SELECT nickname FROM user WHERE nickname = "${nickname}"
      `);
  
  
      if(nickname != checkName[0].nickname){
        const error = new Error("Check your NAME")
        error.statusCode = 400;
        throw error;
      }
      return res.status(201).json({
        "message" : "add Post!"
      })
    } catch (error) {
      console.log(error)
    }
  }
  
    const showPost = async(req, res) => {
      try {
        const postData = await AppDataSource.query(`
        SELECT 
        nickname,
        content, 
        created_at,
        updated_at
        FROM post
        ORDER BY postId DESC;
        `)
        return res.status(200).json({
          "postData" : postData
        })
      } catch (error) {
        console.log(error)
      }
    }

    const updatePost = async(req, res) => {

    }

module.exports = {
    addPost,
    showPost,
    AppDataSource
}