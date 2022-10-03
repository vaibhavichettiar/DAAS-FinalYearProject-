const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  aws_access_key: process.env.AWS_ACCESS_KEY,
  aws_secret_key: process.env.AWS_SECRET_KEY
};