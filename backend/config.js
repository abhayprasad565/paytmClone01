require('dotenv').config()
const MONGOURL = process.env.MONGO;
const JWTSECRET = process.env.JWTSECRET;
module.exports = { MONGOURL, JWTSECRET };