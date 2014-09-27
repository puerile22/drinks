var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
var reader = require('./public/js/filereader.js');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var result;
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
  socket.on('find', function(arr){
    console.log(arr);
    result = reader.pick(arr);
  });
  socket.on('random',function(){
    result = reader.randomDrink();
  });
  socket.on('name search',function(input){
    console.log(input);
    result = reader.quickSearch(input);
  });
  socket.on('ingredients search',function(input){
    result = reader.searchWithType(input);
  });
});
http.listen(9494);

