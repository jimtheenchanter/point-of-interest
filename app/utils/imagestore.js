'use strict';

const fs = require('fs');
const util = require('util');
require('dotenv').config();
const cloudinary = require('cloudinary');
const writeFile = util.promisify(fs.writeFile);
const ImageStore = {


    configure: function(cloudinaryConfig) {

        const credentials = {
            cloud_name: process.env.cloud_name,
            client_id: process.env.api_key,
            client_secret: process.env.api_secret
        };
        cloudinary.config(credentials);
    },


   uploadImage: async function(image) {
       await writeFile('./upload/temp.jpg', image);
       await cloudinary.uploader.upload('./upload/temp.jpg');
   }
};

module.exports = ImageStore;