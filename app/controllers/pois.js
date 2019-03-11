'use strict';

const User = require('../models/user');
const Poi = require('../models/poi');
const ImageStore = require('../utils/imagestore');

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

    // uploadFile: {
    //     handler: async function (request, h) {
    //         const file = request.payload.image;
    //         if (Object.keys(file).length > 0) {
    //             await ImageStore.uploadImage(request.payload.image);
    //             return h.redirect('/)');
    //         }
    //     }
    // },
//
//     //this function allows a user to create a POI of their own
    create: {
        handler: async function (request, h) {

            try {
                //get the id of the person logged in
                const id = request.auth.credentials.id;
                const user = await User.findById(id); //assigns name user to the current id
                const data = request.payload; //defines form payloads as data
                const picture = request.payload.image;
                await ImageStore.uploadImage(request.payload.image);
                 // return h.redirect('/');

                const newPoi = new Poi({
                    name: data.name, //data called name received from form
                    description: data.description,
                    category: data.category,
                    long: data.long,
                    lat: data.lat,
                    creator: user._id,
                    image: picture.image,
                    imageURL: "https://res.cloudinary.com/jimtheenchanter/image/upload/v1551798347/people_with_beards_f8wemo.jpg"
                });

                if (picture.buffer !== undefined) {
                    newPoi.image.data = picture;
                        newPoi.image.contentType = String;
                }
                              // // imageURL: "https://res.cloudinary.com/jimtheenchanter/image/upload/v1551621177/sample.jpg",
                await newPoi.save();
                return h.redirect('/report');
            }
            catch (err) {
                return h.view('main', {errors: [{message: err.message}]});
            }
        } //handler
    }, //create
 //Pois

    deletePoi: {
        handler: async function (request, h) {
            try {
                const id = request.auth.credentials.id;
                // logger.debug(`Deleting poi` ${id});
                this.poi = poi.id;
                response.redirect('/poilist');

                await newPoi.save();
                return h.redirect('/report');
            } catch (err) {
                return h.view('main', {errors: [{message: err.message}]});
            }
        }
    }
    };


module.exports = Pois;
