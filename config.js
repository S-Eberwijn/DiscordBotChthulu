require('dotenv-flow').config();

module.exports = {
    token: process.env.TOKEN,
    author: process.env.AUTHOR,
    prefix: process.env.PREFIX,
    dbUser: process.env.DB_USER,
    dbPassword : process.env.DB_PW
}