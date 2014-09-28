var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
var reader = require('./public/js/filereader.js');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var result,h;
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var api = '?apiKey=ff13db9df08a460998508c2c35fb5ea7';
var baseUrl = 'http://addb.absolutdrinks.com';
var handle = require('handlebars');
var source = '<div class="search-result"><img src="http://assets.absolutdrinks.com/drinks/200x300/{{ id }}.png"><p>{{ name }}</p></div>' 
var template = handle.compile(source);

var searchResult = function(input) {
      //for (var i =0;i<10;i++) {
  request('http://10.10.10.10:9494', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
        h = template(input[0]);
        //console.log(i);
        console.log(h);
       $('.main-content').append(h);
       $.html();
      //};
    };
  });
};
//var jsdom = require("jsdom");
//var $ = require('jquery');
// var handle = require('handlebars');
// var source = ".search-result"
//              "  img src=http://assets.absolutdrinks.com/drinks/200x300/{{id}}.png)/"
//              "  p {{id}}" 
// var template = handle.compile(source);
// var searchResult = function(input) {
//   //var htmlSource = fs.readFileSync('./views/index.jade','utf8');
//   //call_jsdom(htmlSource, function (window) {
//     //var $ = window.$;
//     for (var i =0;i<10;i++) {
//       html = template(input[i]);
//       console.log(html);
//       //$('.main-content').append(html);
//     }
//   };
//   result = result.slice(0,10);
//   for (var i=0;i<result.length;i++) {
//     html = template(result[i]);
//   }
// };
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

//quickSearch('rum');
//setTimeout(function(){console.log(result['result'][0])},2000);


//searchWithType('rum vodka');

var randomDrink = function() {
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


app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));
app.use(express.static(__dirname + '/public'))


app.get('/', function (req, res) {
  res.render('index',
    { title : 'Home' }
  )
});

io.on('connection', function(socket){
  console.log('a user connected');
  var quickSearch = function(input) {
    request({
      url:baseUrl+'/quickSearch/drinks/'+input+'/'+api,
      json:true
    },function(err,response,body) {
      if (!err && response.statusCode === 200) {
        result = body.result;
        //console.log(result);
        socket.emit('search result',result);
      }
    });
  };
  var pick = function(arr) {
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
        socket.emit('search result',result);
      }
    });
  };
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
        result = body.result;
        socket.emit('search result',result);
      }
    });
  };
  var showRecipe = function(input) {
    request({
      url:baseUrl+'/drinks/'+input+'/'+api,
      json:true
    },function(err,response,body) {
    if (!err && response.statusCode === 200) {
        result = body.result;
        console.log(result[0].videos);
        socket.emit('single recipe',result[0]);
      }
    });
  };
  socket.on('find', function(arr){
    pick(arr);
    //searchResult(result);
  });
  socket.on('random',function(){
    andomDrink();
  });
  socket.on('name search',function(input){
    quickSearch(input);
    //setTimeout(function(){reader.searchResult(result);},3000);
    //io.emit('name search',result);
    //setTimeout(function(){searchResult(result['result']);},5000);    
  });
  socket.on('ingredients search',function(input){
    searchWithType(input);
    //searchResult(result);
  });
  socket.on('result',function(input){
    console.log(input);
    showRecipe(input);
  })
});
http.listen(9494);

