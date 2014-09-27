var http = require('http');
var request = require('request');
var api = '?apiKey=ff13db9df08a460998508c2c35fb5ea7';
var baseUrl = 'http://addb.absolutdrinks.com';
var result;
exports.quickSearch = function(input) {
  console.log(input);
  request({
    url:baseUrl+'/quickSearch/drinks/'+input+'/'+api,
    json:true
  },function(err,response,body) {
    if (!err && response.statusCode === 200) {
      result = body.result;
      console.log(result);
      return result;
    }
  });
};
//quickSearch('rum');
//setTimeout(function(){console.log(result['result'][0])},2000);

exports.searchWithType = function(input) {
  input = input.replace(/\W/g, ' ').split(" ");
  for (var i=0;i<input.length;i++){
    if (i !== 0) {
      input[i] = '/and/'+input[i];
    }
  }
  input = input.join("");
  console.log(input);
  request({
    url:baseUrl+'/drinks/withtype/'+input+'/'+api,
    json:true
  },function(err,response,body) {
    if (!err && response.statusCode === 200) {
      result = body.result;
      console.log(result);
      return result;
    }
  });
};
//searchWithType('rum vodka');

exports.randomDrink = function() {
  var rate = Math.floor(Math.random()*200);
  request({
    url:baseUrl+'/drinks/rating/lte'+rate+'/'+api,
    json:true
  },function(err,response,body) {
    if (!err && response.statusCode === 200) {
      result = body.result[0];
      console.log(result);
      return result;
    }
  });
};

exports.pick = function(arr) {
  var skill = parseInt(arr[0]);
  var taste = arr[1];
  var occasion = arr[2];
  var color = arr[3];
  var url = baseUrl+'/drinks';
  if (skill !== 0 ) {
    url = url + '/skill/'+skill;
  }
  if (taste !== 0 ) {
    url = url + '/tasting/'+taste;
  }
  if (occasion !== 0 ) {
    url = url + '/for/'+occasion;
  }
  if (color !== 0 ) {
    url = url + '/colored/'+color;
  }
  url = url+'/'+api;
  request({
    url:url,
    json:true
  },function(err,response,body) {
    if (!err && response.statusCode === 200) {
      result = body.result;
      console.log(result);
      return result;
    }
  });
};

//pick(2,'sweet','afternoon','red','rocks-glass');


