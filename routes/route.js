const express = require("express")
const router = express.Router()
const uploadMedia = require('../config/multer.config')
router.post("/api/v2/upload/file",uploadMedia.single('file'),async(req,res)=>{
    try {
        const AWS = require('aws-sdk');
        const fs = require('fs');

        const AWSCredentials = {
            accessKey: "AKIAY2Q7TG4JKJ2FLQMV",
            secret: "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",
            bucketName: 'viosa-storage'
        };

        const s3 = new AWS.S3({
            accessKeyId: AWSCredentials.accessKey,
            secretAccessKey: AWSCredentials.secret
        });
        if(req.file){
            let file = req.file;
            // Read content from the file
            // const fileContent = fs.readFileSync(file.buffer);

            // Setting up S3 upload parameters
            const params = {
                Bucket: AWSCredentials.bucketName,
                Key: file.originalname,
                Body: file.buffer,
                ACL:'public-read',
 };

            // Uploading files to the bucket
            s3.upload(params, function(err, data) {
                if (err) {
                    throw err;
                }
                res.json({msg:"pdf link send successfully", link:`${data.Location}`});
            });
        } else{
            throw new Error("File not found!")
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})
router.post("/api/v2/upload/pdf",uploadMedia.single('file'),async(req,res)=>{
    try {
        const AWS = require('aws-sdk');
        const fs = require('fs');

        const AWSCredentials = {
            accessKey: process.env.accessKey,
            secret: process.env.secret,
            bucketName: 'awsbucket-project'
        };

        const s3 = new AWS.S3({
            accessKeyId: AWSCredentials.accessKey,
            secretAccessKey: AWSCredentials.secret
        });
        if(req.file){
            let file = req.file;
            // Read content from the file
            // const fileContent = fs.readFileSync(file.buffer);

            // Setting up S3 upload parameters
            const params = {
                Bucket: AWSCredentials.bucketName,
                Key: file.originalname,
                Body: file.buffer,
                ACL:'public-read',
                ContentType:"application/pdf" 
 };

            // Uploading files to the bucket
            s3.upload(params, function(err, data) {
                if (err) {
                    throw err;
                }
                res.json({msg:"pdf link send successfully", link:`${data.Location}`});
            });
        } else{
            throw new Error("File not found!")
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})
module.exports = router
