'use strict';

const Boom = require('boom');
const Poi = require('../models/poi');

const Pois = {

  findByUser: {
    auth: false,
    handler: async function(request, h) {
      const pois = await Poi.find({ creator: request.params.id });
      return pois;
    }
  },

  findAll: {
    auth: false,
    handler: async function(request, h) {
     const pois = await Poi.find();
     return pois;
    }
  },

    findByCategory: {
      auth: false,
      handler: async function(request, h) {
        const pois = await Poi.find({ category: request.params.category });
        return pois;
      }
    },

    createPoi: {
      auth: false,
      handler: async function(request, h) {
        let poi = new Poi(request.payload);
        poi = await poi.save();
        return poi;

      }
    },

    deleteAll: {
      auth: false,
      handler: async function(request, h) {
        await Poi.deleteMany({});
        return { success: true };
      }
    },

    deleteOne: {
      auth: false,
      handler: async function(request, h) {
        const poi = await Poi.deleteOne({ _id: request.params.id });
        if (poi) {
          return { success: true };
          response.redirect('report');
        }
        return Boom.notFound('id not found');
      }
    }

};

module.exports = Pois;
