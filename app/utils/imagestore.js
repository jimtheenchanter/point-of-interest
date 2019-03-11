'use strict';

const fs = require('fs');
const util = require('util');
require('dotenv').config();
const cloudinary = require('cloudinary');
const writeFile = util.promisify(fs.writeFile);

// const cloudinaryConfig= {
//     cloud_name: process.env.cloud_name,
//     api_key: process.env.api_key,
//     client_secret: process.env.api_secret
// };
// cloudinary.config(cloudinaryConfig);
//
//



const ImageStore = {


    configure: function(cloudinaryConfig) {

        const credentials = {
            cloud_name: process.env.cloud_name,
            client_id: process.env.api_key,
            client_secret: process.env.api_secret
        };
        cloudinary.config(credentials);
    },


    //
    // getAllImages: async function() {
    //     const result = await cloudinary.v2.api.resources();
    //     return result.resources;
    // },
    //
    // deleteImage: async function(id) {
    //     await cloudinary.v2.uploader.destroy(id, {});
    // },

    // uploadImage: {
    //     handler: async function (request, h) {
    //         const response = fs.writeFile('./upload/temp.img', request.payload.file, err => {
    //                 if (err) {
    //                     //report error here
    //                 }
    //                 const result = cloudinary.uploader.upload('./upload/temp.img', result => {
    //                     console.log(result);
    //                     const picture = {
    //                         img: result.url,
    //                     };
    //                 });
    //                 return h.redirect('/main');
    //             })
    //         return h.redirect('/main');
    //      }
    // }


   uploadImage: async function(image) {
       await writeFile('./upload/temp.img', image);
       await cloudinary.uploader.upload('./upload/temp.img');
   }
};

module.exports = ImageStore;