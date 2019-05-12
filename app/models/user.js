'use strict';

const Boom = require('boom');
//import mongoose to interact with
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

//define the parameters that make up user model
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email : email});
};

userSchema.methods.comparePassword = function(userPassword) {
    const isMatch = this.password ===  userPassword;
    if (!isMatch) {
        throw new Boom('Password mismatch');
    }
    return this;
};

module.exports = Mongoose.model('User', userSchema);
