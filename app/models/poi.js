'use strict';

// const cloudinary = require('cloudinary');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const poiSchema = new Schema({
    name: String,
    description: String,
    category: String,
    long: Number,
    lat: Number,
    imageURL: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cloudinary_id:String,

});

module.exports = Mongoose.model('Poi', poiSchema);
