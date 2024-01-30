require('dotenv').config()
const MONGOURL = process.env.MONGO;
const JWTSECRET = process.env.JWT_SECRET;
module.exports = { MONGOURL, JWTSECRET };