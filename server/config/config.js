const dotenv = require('dotenv');
dotenv.config();

const cassandra = require('cassandra-driver');
const fs = require('fs');
const sigV4 = require('aws-sigv4-auth-cassandra-plugin');
require('dotenv').config();
const region = process.env.AWS_REGION;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

const auth = new sigV4.SigV4AuthProvider({
  region: region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey
});

const host = 'cassandra.' + region + '.amazonaws.com'
const sslOptions = {
    ca: [
        fs.readFileSync(__dirname + '\\..\\sf-class2-root.crt')
    ],
    host: host,
    rejectUnauthorized: true
};

const client = new cassandra.Client({
    contactPoints: [host],
    localDataCenter: region,
    authProvider: auth,
    sslOptions: sslOptions,
    protocolOptions: { port: 9142 }
});

module.exports = {
  client,
  aws_access_key: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_key: process.env.AWS_SECRET_ACCESS_KEY
};