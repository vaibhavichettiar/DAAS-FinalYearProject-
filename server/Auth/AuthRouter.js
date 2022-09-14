const router = require('express').Router();
const Login = require('./Login.js');
const registeruser = require('./registerUser.js');
const corsMethodsAllowed = require('../corsMethodsAllowed.js');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.post('/login', jsonParser, Login.loginUser);
router.post('/register', jsonParser, registeruser.registerUser);


module.exports = router;