const jwt = require("jsonwebtoken");
require('dotenv').config();
const backendUtils = require('../../common/backendUtils.js');


const authenticateToken = (token, res) => {
    if (token == null) return false;
    try{
      const user = jwt.verify(token, process.env.TOKEN_SECRET );
      return user;
    } 
    catch (err){
      if(err.message === 'jwt malformed'){
        return backendUtils.respondMessage( res, 400,'Invalid token');
      }
      if(err.message === 'jwt expired'){
        return backendUtils.respondMessage( res, 440,'session expired');
      }
      else {
        return backendUtils.respondMessage( res, 500,err.message);
      }
    }
  }

const generateAccessToken = (loginUser) => {
    const token = jwt.sign({loginUser}, process.env.TOKEN_SECRET, { expiresIn: '86400s' });
    return token;
  }

module.exports = {
  authenticateToken,
  generateAccessToken,
};