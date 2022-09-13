const backendUtils = require("../common/backendUtils");
const logger = require("../logger/logger");
const crypt = require('./crypt.js');
const usersDetailsOperation = require('./userDetailOperation.js')

const registerUser = async (req, res) => {
    try{
        logger.info("registerUser.registerUser initiated");
        const user = req.body;
        usersDetailsOperation.registerUser(user.name,user.password)
        // const userExists = await usersDetailsOperation.getUserWithUsername(user.username);
        // if (userExists.length) {
        //     backendUtils.respondMessage(res, 409, "Username already exists");
        // }
        // const emailExists = await usersDetailsOperation.getUserWithEmail(user.email);
        // if (emailExists.length) {
        //     return backendUtils.respondMessage(res, 409, "email already exists");
        // }
        // user.password = crypt.encrypt(user.password);
        // await usersDetailsOperation.saveNewUser(user.firstname, user.lastname, user.username, user.password, user.email, user.age, user.sex);
        // logger.debug(`successfully registered the user: ${user.username}`);
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
