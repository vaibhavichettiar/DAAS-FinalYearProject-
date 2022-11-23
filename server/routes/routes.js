const router = require('express').Router();
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const Login = require('./Auth/Login.js');
const registeruser = require('./Auth/registerUser.js');
const fileUpload = require('./FileUpload/fileupload.js');
const processData = require('./ProcessData/processData.js');
const trainModel = require('./TrainModel/trainModel.js');
const tables = require('./Tables/tables');
const {userData} = require('./Users/userDetails');
const predict = require('./Predict/predict.js');

router.post('/login', jsonParser, Login.loginUser);
router.post('/register', jsonParser, registeruser.registerUser);
router.post('/fileUpload', jsonParser, fileUpload.dataUpload);
router.post('/process', jsonParser, processData.processData);
router.post('/train', jsonParser, trainModel.trainModel);
router.get('/tables', jsonParser, tables.tabularData);
router.get('/userProfile', jsonParser, userData);
router.get('/predict', jsonParser, predict.predict);

module.exports = router;