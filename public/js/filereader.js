var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var api = '?apiKey=ff13db9df08a460998508c2c35fb5ea7';
var baseUrl = 'http://addb.absolutdrinks.com';
var result,h;
var fs = require('fs');
var handle = require('handlebars');
var source = '<div class="search-result"><img src="http://assets.absolutdrinks.com/drinks/200x300/{{ id }}.png"><p>{{ name }}</p></div>' 
var template = handle.compile(source);

var jsdom = require('jsdom');

var searchResult = function(input) {
  request('http://10.10.10.10:9494', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      // for (var i =0;i<10;i++) {
      //   h = template(input[i]);
      //   console.log(i);
      //   console.log(h);
      console.log($('.main-content'))
        $('.main-content').append('<p>aljfa</p>');
        $.html();
      //};
    }
  });
};
  // for (var i =0;i<10;i++) {
  //   h = template(input[i]);
  //   console.log(h);
  //   jsdom.env(
  //     "http://10.10.10.10:9494",
  //     ['https://code.jquery.com/jquery-2.1.1.min.js'],
  //     function(err, window) {
  //       var $ = window.jQuery;
  //       window.$('.main-content').append(h);
  //     }
  //   );
  // };
// };
  // var htmlSource = fs.readFileSync('views/layout.jade','utf8');
  // console.log(htmlSource);
  //   for (var i =0;i<10;i++) {
  //     html = template(input[i]);
  //       console.log(html);
  //     jsdom.env(htmlSource, ["http://code.jquery.com/jquery.js"], function (errors, window) {
  //       var $ = window.$;
  //       $(".main-content").append(html);
  //     });
  //     //$('.main-content').append(html);
  //   };
  // };

exports.quickSearch = function(input) {
  request({
    url:baseUrl+'/quickSearch/drinks/'+input+'/'+api,
    json:true
  },function(err,response,body) {
    if (!err && response.statusCode === 200) {
      result = body.result;
      searchResult(result);
    }
  });
};

exports.searchWithType = function(input) {
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
      result = body.result;
      return result;
    }
  });
};

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



