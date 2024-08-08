const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
require('dotenv').config();


// AWS S3 Client create karein
const s3Client = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_KEY,
  },
});
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'rdfpl',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
  }),
});

module.exports = upload;
