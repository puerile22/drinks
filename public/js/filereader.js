var http = require('http');
var request = require('request');
var api = '?apiKey=ff13db9df08a460998508c2c35fb5ea7';
var baseUrl = 'http://addb.absolutdrinks.com';
var result;
var quickSearch = function(input) {
  request({
    url:baseUrl+'/quickSearch/drinks/'+input+'/'+api,
    json:true
  },function(err,response,body) {
    if (!err && response.statusCode === 200) {
      result = body;
    }
  });
};
//quickSearch('rum');
//setTimeout(function(){console.log(result['result'][0])},2000);

var searchWithType = function(input) {
  input = input.replace(/\W/g, ' ').split(" ");
  for (var i=0;i<input.length;i++){
    if (i !== 0) {
      input[i] = '/and/'+input[i];
    }
  }
  input = input.join("");
  request({
    url:baseUrl+'/drinks/withtype/'+input+'/'+api,
    json:true
  },function(err,response,body) {
    if (!err && response.statusCode === 200) {
      result = body;
      console.log(result);
    }
  });
};
//searchWithType('rum vodka');

var randomDrink = function() {
  var rate = Math.floor(Math.random()*94);
  request({
    url:baseUrl+'/drinks/rating/'+rate+'/'+api,
    json:true
  },function(err,response,body) {
    if (!err && response.statusCode === 200) {
      result = body.result[0];
      console.log(result);
    }
  });
};

//randomDrink();
var pick = function(skill,taste,occasion,color) {
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
    }
  });
};

pick(2,'sweet','afternoon','red','rocks-glass');


