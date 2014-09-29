var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var result;
var fs = require('fs');
var request = require('request');
var api = '?apiKey=ff13db9df08a460998508c2c35fb5ea7';
var baseUrl = 'http://addb.absolutdrinks.com';

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

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
    if (skill !== '0' ) {
      url = url + '/skill/'+skill;
    }
    if (taste !== '0' ) {
      url = url + '/tasting/'+taste;
    }
    if (occasion !== '0' ) {
      url = url + '/for/'+occasion;
    }
    if (color !== '0' ) {
      url = url + '/colored/'+color;
    }
    url = url+'/'+api;
    console.log(url);
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
        socket.emit('single recipe',result[0]);
      }
    });
  };
  var randomDrink = function() {
    var rate = Math.floor(Math.random()*200);
    request({
      url:baseUrl+'/drinks/rating/lte'+rate+'/'+api,
      json:true
    },function(err,response,body) {
      if (!err && response.statusCode === 200) {
        i = body.result.length;
        Math.floor(Math.random()*i)
        result = body.result[Math.floor(Math.random()*i)];
        socket.emit('random recipe',result);
      }
    });
  };
  var topDrink = function() {
    request({
      url:'http://addb.absolutdrinks.com/drinks/rating/gte100/?apiKey=ff13db9df08a460998508c2c35fb5ea7&start=0&pageSize=25',
      json:true
    },function(err,response,body) {
    if (!err && response.statusCode === 200) {
        result = body.result;
        socket.emit('top recipe',result);
      }
    });
  };
  socket.on('find', function(arr){
    pick(arr);
  });
  socket.on('random',function(){
    randomDrink();
  });
  socket.on('name search',function(input){
    quickSearch(input);
  });
  socket.on('ingredients search',function(input){
    searchWithType(input);
  });
  socket.on('result',function(input){
    showRecipe(input);
  });
  topDrink();
});
http.listen(9494);
