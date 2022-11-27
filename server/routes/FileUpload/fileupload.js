const backendUtils = require("../../common/backendUtils");
const logger = require("../../logger/logger");
let path = require('path');
let formidable = require('formidable');
let fs = require('fs');
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
            let start = new Date().getTime();
            let upload = s3Stream.upload({
                "Bucket": bucket,
                "Key": part.filename
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
        }

        form.parse(req, function(err, fields, files) {
            if (err) {
                backendUtils.respond(res, 500, err);
            }
            backendUtils.respond(res, 200, 'file uploaded successfully');
        });
        
}

module.exports = {
    dataUpload
};
