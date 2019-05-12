'use strict';

const User = require('../models/user');
const Poi = require('../models/poi');

//expose functions of imagestore
const ImageStore = require('../utils/imagestore');
//declare use of dotenv
require('dotenv').config();

const Pois = {
    home: {
        handler: function (request, h) {
            return h.view('home', {title: 'Create a POI'});
        }
    },
    report: {
        handler: async function (request, h) {
            try {
                //looks for pois created by users
                const pois = await Poi.find().populate('creator');
                return h.view('report', {
                    title: 'POIs',
                    pois: pois,
                });
            } catch (err) {
                return h.view('main', {errors: [{message: err.message}]});
            }
        }
    },



//     //this function allows a user to create a POI of their own
    create: {
        // runs an asynchronous function that returns a page redirect - h
        handler: async function (request, h) {

            try {
                //get the id of the person logged in
                const id = request.auth.credentials.id;
                const user = await User.findById(id); //assigns name user to the current id
                const data = request.payload; //defines form payloads as data
                const picture = request.payload.image; //takes in the image field as picture
                const c_response = await ImageStore.uploadImage(picture); //calls uploadimage function and passes in the image data


                const newPoi = new Poi({

                    name: data.name, //data called name received from form
                    description: data.description,
                    category: data.category,
                    long: data.long,
                    lat: data.lat,
                    creator: user._id,
                    imageURL: c_response.url,
                    cloudinary_id: c_response.cloudinary_id
                });

                await newPoi.save();
                return h.redirect('report');
            }
            catch (err) {return h.view('main', {errors: [{message: err.message}]});
            }
        }
    },





    deletePoi: {
        auth: false,
        handler: async function(request, h) {
            const c_poi =  await Poi.findById(request.params.id);
            const c_image_id = c_poi.cloudinary_id;
            await ImageStore.deleteImage(c_image_id);
            const poi = await Poi.deleteOne({ _id: request.params.id });
            // await ImageStore.uploadImage(picture);
            if (poi) {
                //return { success: true };
                return h.redirect('/report');

            }
            //return.redirect('/report');
            return Boom.notFound('id not found');
        }
    }
    };


module.exports = Pois;
