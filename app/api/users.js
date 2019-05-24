'use strict';

const Boom = require('boom');
const User = require('../models/user');
const utils = require('./utils.js');

const Users = {

  find: {
    auth: false,
    //   {
    //         strategy: 'jwt',
    // },
    handler: async function(request, h) {
      const users = await User.find();
      return users;
    }
  },

  findOne: {
    auth: false,
    // auth: {
    //   strategy: 'jwt',
    // },
    handler: async function(request, h) {
      //try statement to catch incorrect addresses and return a 404
      try {
        const user = await User.findOne({ _id: request.params.id });
        //if user ID is incorrect it returns a 404
        if (!user) {
          return Boom.notFound('No User with this id');
        }
        return user;
      } catch (err) {
        return Boom.notFound('No User with this id');
      }
    }
  },

  create: {
    auth: false,
    // auth: {
    //   strategy: 'jwt',
    // },
    handler: async function(request, h) {
      const newUser = new User(request.payload);
      const user = await newUser.save();
      if (user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation('error creating user');
    }
  },

  deleteAll: {
    auth: false,
    // auth: {
    //   strategy: 'jwt',
    // },
    handler: async function(request, h) {
      await User.deleteMany({});
      return { success: true };
    }
  },

  deleteOne: {
    auth: false,
    // auth: {
    //   strategy: 'jwt',
    // },
    handler: async function(request, h) {
      const response = await User.deleteOne({ _id: request.params.id });
      if (response.deletedCount === 1) {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  },



//authentication handler for JWToken
authenticate: {
  auth: false,
    handler: async function(request, h) {
    try {
      const user = await User.findOne({ email: request.payload.email });
      if (!user) {
        return Boom.notFound('Authentication failed. User not found');
      }
      const token = utils.createToken(user);
      return h.response({ success: true, token: token }).code(201);
    } catch (err) {
      return Boom.notFound('internal db failure');
    }
  }
},

};

module.exports = Users;
