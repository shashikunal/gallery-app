require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  SERVER: process.env.MY_LOCAL_SERVER,
  DB_URL: process.env.MONGODB_DATABASE_URL,
};
