const backendUtils = require("../../common/backendUtils");
const logger = require("../../logger/logger");
const usersDetailsOperation = require('./userDetailOperation.js');
const crypt = require('./crypt.js');


const registerUser = async (req, res) => {
    try{
        logger.info("registerUser.registerUser initiated");
        const user = req.body;
        user.password = crypt.encrypt(user.password);
        usersDetailsOperation.registerUser(user.username,user.password);
        backendUtils.respond(res, 200, 'user successfully registered');
       } 
    catch(err) {
        logger.error(`usersDetailsOperation.saveNewUser() ${err}`);
        backendUtils.respondMessage(res, 500, err);
    }
}

module.exports = {
    registerUser
};
