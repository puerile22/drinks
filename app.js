var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
var reader = require('./public/js/filereader.js');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var result;
var fs = require('fs');
//var jsdom = require("jsdom");
//var $ = require('jquery');
var handle = require('handlebars');
var source = ".search-result"
             "  img src=http://assets.absolutdrinks.com/drinks/200x300/{{id}}.png)/"
             "  p {{id}}" 
var template = handle.compile(source);
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
    result = reader.pick(arr);
    //searchResult(result);
  });
  socket.on('random',function(){
    result = reader.randomDrink();
    console.log('this is'+result);
  });
  socket.on('name search',function(input){
    result = reader.quickSearch(input);
    //setTimeout(function(){searchResult(result['result']);},5000);    
  });
  socket.on('ingredients search',function(input){
    result = reader.searchWithType(input);
    //searchResult(result);
  });
});
http.listen(9494);

