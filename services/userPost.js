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

const postDashboard = async (req, res) => {
  try {
    const postData = await AppDataSource.query(`
    INSERT INTO post, nickname, content FROM users VALUES("${nickname}", "${content}")
  `);

    console.log("create new post data : ", postData);

    res.status(200).json({
      message: "post complete!",
    });
  } catch (error) {
    console.log(err);
    return res.status(400).json({
      message: "post failed",
    });
  }
};

const getDashboard = async (req, res) => {
  try {
    const postData = await AppDataSource.query(`
    SELECT * FROM post ORDER BY created_at DESC
  `);

    console.log("create new post data : ", postData);

    res.status(200).json({ postData });
  } catch (error) {
    console.log(err);
    return res.status(400).json({
      message: "post failed",
    });
  }
};

AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

module.exports = {
  postDashboard,
  getDashboard,
};
