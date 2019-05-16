'use strict';
//controller for Points of Interest Functions

const User = require('../models/user');
const Poi = require('../models/poi');
//expose functions of imageStore
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
                const u_id = request.auth.credentials.id;
                  for(let p in pois){
                    console.log(pois[p].creator.id)
                    if(pois[p].creator.id == u_id){
                        pois[p].show_delete = true;
                    }else{
                        pois[p].show_delete = false;
                    }
                }
                return h.view('report', {
                    title: 'POIs',
                    pois: pois,
                });
            } catch (err) {
                return h.view('main', {errors: [{message: err.message}]});
            }
        }
    },

    reportCategory: {
        handler: async function (request, h) {
            try {
                //looks for pois created by users
                const pois = await Poi.findByCategory().populate('category');
                return h.view('report', {
                    title: 'POI by Categories',
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


                // L.marker([data.lat, data.long]).addTo(map)
                //   .bindPopup(data.name)
                //   .openPopup();

                const newPoi = new Poi({
                    name: data.name, //data called name received from form
                    description: data.description,
                    category: data.category,
                    long: data.long,
                    lat: data.lat,
                    creator: user._id,
                    imageURL: c_response.url,
                    cloudinary_id: c_response.cloudinary_id,
                    image: picture.image,
                });


                await newPoi.save();
                // this.marker= marker;
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
