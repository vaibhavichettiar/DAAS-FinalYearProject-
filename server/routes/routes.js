const router = require('express').Router();
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const Login = require('./Auth/Login.js');
const registeruser = require('./Auth/registerUser.js');
const fileUpload = require('./FileUpload/fileupload.js');
const processData = require('./ProcessData/processData.js');
const trainModel = require('./TrainModel/trainModel.js');

router.post('/login', jsonParser, Login.loginUser);
router.post('/register', jsonParser, registeruser.registerUser);
router.post('/fileUpload', jsonParser, fileUpload.dataUpload);
router.post('/process', jsonParser, processData.processData);
router.post('/train', jsonParser, trainModel.trainModel);

module.exports = router;