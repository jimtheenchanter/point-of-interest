'use strict';
//test to show the existing points of interest
const assert = require('chai').assert;
const axios = require('axios');

suite('POI API tests', function () {

  test('get points of interest', async function () {
    const response = await axios.get('http://localhost:3000/api/pois');
    const pois = response.data;
    assert.equal(5, pois.length);

//tests name and category of first POI object
    assert.equal(pois[0].name, 'Geoff\'s');
    assert.equal(pois[0].category, 'Restaurant');
//tests name and category of 2nd POI object
    assert.equal(pois[1].name, 'Kazbar');
    assert.equal(pois[1].category, 'Pub');

  });
});