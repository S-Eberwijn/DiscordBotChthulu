require('dotenv-flow').config();

module.exports = {
    token: process.env.TOKEN,
    author: process.env.AUTHOR,
    prefix: process.env.PREFIX
}