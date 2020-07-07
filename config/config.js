const DEFUALT_PORT = 3000;

module.exports = Object.freeze({
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT || DEFUALT_PORT
})