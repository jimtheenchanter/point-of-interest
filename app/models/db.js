'use strict';

require('dotenv').config();

const Mongoose = require('mongoose');

Mongoose.connect(process.env.db, { useNewUrlParser: true }) ;
const db = Mongoose.connection;

db.on('error', function(err) {
    console.log(`database connection error: ${err}`);
});

db.on('disconnected', function() {
    console.log('database disconnected');
});

db.once('open', function() {
    console.log(`database connected to ${this.name} on ${this.host}`);
});

// db.getCollection('pois').find({});
//
// db.getCollection('pois').delete({})