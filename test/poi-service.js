'use strict';

const axios = require('axios');
const baseUrl = 'http://localhost:3000';

class PoiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  };

  async getUsers() {
    try {
      const response = await axios.get(this.baseUrl + '/api/users');
      return response.data;
    } catch (e) {
      return null;
    }
  };

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/users/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  };

  async createUser(newUser) {
    try {
      const response = await axios.post(this.baseUrl + 'api/users', newUser);
      return response.data;
    } catch (e) {
      return null;
    }
  };

  async deleteAllUsers() {
    try {
      const response = await axios.delete(this.baseUrl + '/api/users');
      return response.data;
    } catch (e) {
      return null;
    }
  };

  async deleteOneUser(id) {
    try {
      const response = await axios.delete(this.baseUrl + '/api/users/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  };



  async createPoi(poi) {
    try {
      const response = await axios.post(this.baseUrl + '/api/pois', poi);
      return response.data;
    } catch (e) {
      return null;
    }
  };

  async getPois(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/pois' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  };

  async deleteAllPois() {
    try {
      const response = await axios.delete(this.baseUrl + '/api/pois');
      return response.data;
    } catch (e) {
      return null;
    }
  };

  async authenticate(user) {
    try {
      const response = await axios.post('/api/users/authenticate', user);
      return response.data;
    } catch (e) {
      return null;
    }
  };
}

module.exports = PoiService;
