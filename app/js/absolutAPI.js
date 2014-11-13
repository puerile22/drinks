var request = require('request');

var config = {
  api: '?apiKey=ff13db9df08a460998508c2c35fb5ea7',
  baseUrl: 'http://addb.absolutdrinks.com'
}

module.exports = function(input){
  var quickSearch = function(func) {
    request({
      url: config.baseUrl + '/quickSearch/drinks/' + input + '/' + config.api,
      json: true
    }, func);
  };

  var pick = function(func) {
    var skill = parseInt(input[0]);
    var taste = input[1];
    var occasion = input[2];
    var color = input[3];
    var url = config.baseUrl + '/drinks';
    if (skill !== '0' ) {
      url = url + '/skill/' + skill;
    }
    if (taste !== '0' ) {
      url = url + '/tasting/' + taste;
    }
    if (occasion !== '0' ) {
      url = url + '/for/' + occasion;
    }
    if (color !== '0' ) {
      url = url + '/colored/' + color;
    }
    url = url + '/' + config.api;
    request({
      url: url,
      json: true
    }, func);
  };

  var searchWithType = function(func) {
    input = input.replace(/\W/g, ' ').split(" ");
    for (var i = 0; i < input.length; i++){
      if (i !== 0) {
        input[i] = '/and/' + input[i];
      }
    }
    input = input.join("");
    request({
      url: config.baseUrl + '/drinks/withtype/' + input + '/' + config.api,
      json: true
    }, func);
  };

  var showRecipe = function(func) {
    request({
      url: config.baseUrl + '/drinks/' + input + '/' + config.api,
      json: true
    }, func);
  };

  var randomDrink = function(func) {
    var rate = Math.floor(Math.random() * 200);
    request({
      url: config.baseUrl + '/drinks/rating/lte' + rate + '/' + config.api,
      json: true
    }, func);
  };
  var topDrink = function(func) {
    request({
      url: 'http://addb.absolutdrinks.com/drinks/rating/gte100/?apiKey=ff13db9df08a460998508c2c35fb5ea7&start=0&pageSize=25',
      json: true
    }, func);
  };

  return {
    quickSearch: quickSearch,
    pick: pick,
    searchWithType: searchWithType,
    showRecipe: showRecipe,
    randomDrink: randomDrink,
    topDrink: topDrink
  }
}