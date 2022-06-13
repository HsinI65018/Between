const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
    secretAccessKey: process.env.SECREAT_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
    region: process.env.REGION
});

const s3 = new aws.S3();

const uploadToS3 = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        contentDisposition: "inline",
        key: function(req, file, cb){
            cb(null, file.originalname);
        }
    })
});

module.exports = uploadToS3;