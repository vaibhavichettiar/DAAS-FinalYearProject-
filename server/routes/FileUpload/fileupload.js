const backendUtils = require("../../common/backendUtils");
const logger = require("../../logger/logger");
let path = require('path');
let formidable = require('formidable');
let fs = require('fs');
const { client } = require("../../config/config");
const { v4: uuidv4 } = require('uuid');
const cassandra = require('cassandra-driver');
const {aws_access_key, aws_secret_key} = require("../../config/config");

let AWS = require('aws-sdk');
let s3 = new AWS.S3({
    accessKeyId: aws_access_key,
    secretAccessKey: aws_secret_key,
    apiVersion: '2006-03-01'
});
let s3Stream = require('s3-upload-stream')(s3);
let bucket = 'daas1';

const dataUpload = async (req, res) => {
        console.log(req.headers.authorization.split(" ")[1]);
        
        //******************************************//
        //this userid can be used to create the filename.
        const userid = req.headers.authorization.split(" ")[1];
        //******************************************//
        console.log("UserID: "  + userid);
        var filename = undefined
        var form = formidable.IncomingForm();
        var fileName, dataSetName, fileLocation, fileSize;
        form.multiples = true;
        form.uploadDir = path.join(path.dirname(__dirname), '../uploads');

        form.on('error', function (err) {
            console.log('An error occured: \n' + err);
        });
        
        form.on('end', function () {
            console.log(fileName, dataSetName, fileLocation, fileSize);
        });

        form.onPart = function(part) {
            console.log("part : ", part);
            if(typeof part.filename != 'undefined'){

                let start = new Date().getTime();
                let upload = s3Stream.upload({
                    "Bucket": bucket,
                    "Key": userid + "/" + part.filename
                });
                upload.concurrentParts(5);

                upload.on('error', function (error) {
                    console.log('errr',error);
                });
                upload.on('part', function (details) {
                    console.log('part',details);
                });
                upload.on('uploaded', function (details) {
                    let end = new Date().getTime();
                    console.log('it took',end-start);
                    console.log('uploaded',details);
                });
                part.pipe(upload);
                filename = part.filename
            }
        }

        form.parse(req, function(err, fields, files) {
            if (err) {
                backendUtils.respond(res, 500, err);
            }
            auditDatasetDetails(userid, filename)
            backendUtils.respond(res, 200, 'file uploaded successfully');
        });
        
}

const auditDatasetDetails = async ( userid, datasetName) => {
    const query = `INSERT INTO daas_ks.dataset_metadata (id, "userId" , table_name, name, job_type, job_status) values(?,?,?,?,?,?);`;
    client.execute(query, [uuidv4(), userid, null, datasetName, null, 0],
        { consistency: cassandra.types.consistencies.localQuorum, prepare: true })
}

module.exports = {
    dataUpload
};
