const Pois = require('./app/api/pois');
const Users= require('./app/api/users');

module.exports = [
  //list all pois
  { method: 'GET', path: '/api/pois', config: Pois.findAll },
  //list specific poi
  { method: 'POST', path: '/api/pois', config: Pois.createPoi },
  { method: 'DELETE', path: '/api/pois/{id}', config: Pois.deleteOne },
  { method: 'DELETE', path: '/api/pois', config: Pois.deleteAll },

  { method: 'GET', path: '/api/users', config: Users.find },
  { method: 'GET', path: '/api/users/{id}', config: Users.findOne },
  { method: 'POST', path: '/api/users', config: Users.create },
  { method: 'DELETE', path: '/api/users/{id}', config: Users.deleteOne },
  { method: 'DELETE', path: '/api/users', config: Users.deleteAll },
  { method: 'GET', path: '/api/users/{id}/pois', config: Pois.findByUser },
  { method: 'GET', path: '/api/pois/{category}', config: Pois.findByCategory }

];
