const backendUtils = require("../common/backendUtils");
const logger = require("../logger/logger");
const jwt = require("./jwt.js");
const usersDetailsOperation = require('./userDetailOperation.js');
const crypt = require('./crypt.js');

const loginUser = async (req, res) => {
    logger.info('Login.loginUser initiated');
    const user = req.body;
    if(!user.username || !user.password){
        backendUtils.respondMessage(res,400,"username or password is null");
    }
    try{
        const username = user.username;
        let result = await usersDetailsOperation.getPasswordForUsername(username);
        if (!result || result.length == 0) {
            backendUtils.respondMessage(res,404,"Username or Password is wrong");
        }
        password = crypt.decrypt(result);
        if(user.password !== password){
            backendUtils.respondMessage(res,404,"Username or Password is wrong");
        }
        const token = jwt.generateAccessToken(user);
        const userObject = {username: user.username, token: token};
        backendUtils.respond(res,200,userObject);
    } catch (err){
        logger.error(err);
        backendUtils.respondMessage(res,500,err);
    }
}

module.exports = {
    loginUser
};
