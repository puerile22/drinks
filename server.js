var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var result;
var absolut = require('./app/js/absolutAPI');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('port', (process.env.PORT || 8080))
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/app'
  , compile: compile
  }
));
app.use(express.static(__dirname + '/app'));

app.get('/', function (req, res) {
  res.render('index',
    { title : 'Home' }
  )
});

io.on('connection', function(socket){
  console.log('a user connected');
  var callbackConstructor = function(eventName){
    return function(err, response, body) {
      if (!err && response.statusCode === 200) {
        result = body.result;
        socket.emit(eventName, result);
      }
    };
  };

  socket.on('find', function(arr){
    var absolutAPI = absolut(arr);
    absolutAPI.pick(callbackConstructor('search result'));
  });

  socket.on('random', function(){
    var absolutAPI = absolut();
    absolutAPI.randomDrink(function(err, response, body) {
      if (!err && response.statusCode === 200) {
        i = body.result.length;
        Math.floor(Math.random() * i)
        result = body.result[Math.floor(Math.random() * i)];
        socket.emit('random recipe', result);
      }
    });
  });

  socket.on('name search', function(input){
    var absolutAPI = absolut(input);
    absolutAPI.quickSearch(callbackConstructor('search result'));
  });

  socket.on('ingredients search', function(input){
    var absolutAPI = absolut(input);
    absolutAPI.searchWithType(callbackConstructor('search result'));
  });

  socket.on('result', function(input){
    var absolutAPI = absolut(input);
    absolutAPI.showRecipe(function(err, response, body) {
    if (!err && response.statusCode === 200) {
        result = body.result;
        socket.emit('single recipe', result[0]);
      }
    });
  });
  var absolutAPI = absolut();
  absolutAPI.topDrink(callbackConstructor('top recipe'));
});

http.listen(app.get('port'), function(){
  console.log('Listening on server *:' + app.get('port'));
});
