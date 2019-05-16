'use strict';
//test to show the existing points of interest
const assert = require('chai').assert;
const axios = require('axios');

suite('User API tests', function () {

  test('get users', async function() {
    const response = await axios.get('http://localhost:3000/api/users');
    const users = response.data;
    assert.equal(3, users.length);


//tests name and category of first user object
    assert.equal(users[0].firstName, 'Homer');
    assert.equal(users[0].lastName, 'Simpson');
//tests name and category of 2nd user object
    assert.equal(users[1].firstName, 'Marge');
    assert.equal(users[1].lastName, 'Simpson');
//tests name and category of 3rd user object
    assert.equal(users[2].firstName, 'Lisa');
    assert.equal(users[2].lastName, 'Simpson');
  });


  test('get one user', async function() {
    const response = await axios.get('http://localhost:3000/api/users');
    const users = response.data;
    assert.equal(3, users.length);


    // const oneUserUrl = 'http://localhost:3000/api/users/' + users[0]._id;
    // response = await axios.get(oneUserUrl);
    // const oneCandidate = response.data;

  })
});