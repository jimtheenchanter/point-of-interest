'use strict';

const User = require('../models/user');
const Poi = require('../models/poi');

const Pois = {
    home: {
        handler: function(request, h) {
            return h.view('home', { title: 'Create a POI' });
        }
    },
    report: {
        handler: async function(request, h) {
            try {
                const pois = await Poi.find().populate('creator');
                return h.view('report', {
                    title: 'POIs',
                    pois: pois
                });
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },

    //this function allows a user to create a POI of their own
    create: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const data = request.payload;
                const newPoi = new Poi({
                    name: data.name,
                    description: data.description,
                    // creator: {
                    //     type: Schema.Types.ObjectId,
                    //     ref: 'User'
                    // },

                    creator: user._id
                });
                await newPoi.save();
                return h.redirect('/report');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    }
};

module.exports = Pois;
