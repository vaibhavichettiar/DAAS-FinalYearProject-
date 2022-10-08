const router = require('express').Router();
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const Login = require('./Auth/Login.js');
const registeruser = require('./Auth/registerUser.js');
const fileUpload = require('./FileUpload/fileupload.js');

router.post('/login', jsonParser, Login.loginUser);
router.post('/register', jsonParser, registeruser.registerUser);
router.post('/fileUpload', jsonParser, fileUpload.dataUpload);

module.exports = router;