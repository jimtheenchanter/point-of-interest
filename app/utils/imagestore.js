'use strict';
//image functions to upload images from client to cloudinary
const fs = require('fs');
const util = require('util');
require('dotenv').config(); //use to access credentials and secret keys etc
const cloudinary = require('cloudinary'); //host for images online


const writeFile = util.promisify(fs.writeFile);

const ImageStore = {

  configure: function(cloudinaryConfig) {
    const credentials = {
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret
    };
    cloudinary.config(credentials);
  },

  getAllImages: async function() {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },
//function to delete image from cloudinary
  deleteImage: async function(id) {
    await cloudinary.v2.uploader.destroy(id, {});
    console.log("image deleted");
  },

  //function to upload image to temp file and then to cloudinary
  uploadImage: async function(imagefile) {
    let response = {url:"", cloudinary_id:""};
    await writeFile('./public/temp.img', imagefile);
    await cloudinary.uploader.upload('./public/temp.img',function(result){
      console.log(result);
      response.url = result.url;
      response.cloudinary_id = result.public_id;
    });

    return response;
  }
};












module.exports = ImageStore;

// const cloudinaryCredentials = {
//     cloud_name : process.env.cloud_name,
//     client_id : process.env.api_key,
//     client_secret : process.env.api_secret,
//     access_image : process.env.secure_delivery
// };
// cloudinary.config(cloudinaryCredentials);
//
// const writeFile = util.promisify(fs.writeFile); //allows writing files
// //image store to handle all cloudinary interactions
// const ImageStore = {
//
//     // uploadImage: async function(request, h) {
//     //     await writeFile('./upload/temp.jpg', image); //werites the image locally as temp
//     //     await cloudinary.uploader.upload('./upload/temp.jpg',
//     //         { use_filename: true,
//     //           unique_filename: false},
//     //         function(error, result) { console.log(result, error);
//     //         }
//     //         ); //uploads to cloudinary account
//     // },
//
//     uploadImage:{
//         handler: async function(request, h) {
//         const response = writeFile('./upload/temp.jpg', request.payload.image, err=>
//         {if (err)
//         {print("error")}
//          //writes the image locally as temp
//         const result= cloudinary.uploader.upload('./upload/temp.jpg',
//             { use_filename: true,
//                 unique_filename: false}, result => {
//         console.log(result);
//         const pic = {
//             imgUrl: result.url
//         };
//
//         });
//           })
//             }
//          //uploads to cloudinary account
//     },
//
//
//     getImage: async function() {
//         // Poi.findOne( {_id: request.params_id}).then(newPoi =>
//         // {reply(newPoi.image.data).type('image')})
//         // const result = await cloudinary.image(public_id);
//         // return result(public_id) ;
//          cloudinary.image(cloudinaryCredentials.access_image + image.public_id, {type: "fetch"} )
//
//    },
//
//
//
//
// };

