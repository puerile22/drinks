var arr;
var source = $('#search-result').html();
var template = Handlebars.compile(source);
var sourceSingle = $('#single-recipe').html();
var templateSingle = Handlebars.compile(sourceSingle);
var h,searchResult;
var socket = io();
socket.on('search result',function(input){
  var n = 12;
  if (input.length<12 && input.length !== 0) {
    n = input.length;
  } else if (input.length === 0){
    $('.main-content').append('<h2>No results found! Please try again.</h2>');
    return; 
  } 
  for (var i =0;i<n;i++) {
    h = template(input[i]);
    $('.main-content').append(h);
  }
});

socket.on('single recipe',function(input){
  input.video = input.videos[0].video;
  h = templateSingle(input);
  console.log(h);
  $('.main-content').append(h);
});

socket.on('random recipe',function(input){
  input.video = input.videos[0].video;
  h = templateSingle(input);
  console.log(h);
  $('.main-content').append(h);
  $('.main-content').find('.back').remove();
});

socket.on('top recipe',function(input){
  var array=[];
  for(var i = 0;i<9;i++) {
    var j = Math.floor(Math.random()*input.length);
    array.push(input.splice(j,1));
    h = template(array[i][0]);
    $('.main-content').append(h);
  }
});

$(document).ready(function(){
  $('.fa-random').click(function(e){
    $('.main-content').empty();
    socket.emit('random',function(){
    });
  });
  $('.search-text').keypress(function(e){
      var key = e.which;
      if (key === 13) {
        $(document).trigger('search');
        $('.main-content').empty();
      }
    });
  $(document).on('search',function(){
    var type = $('#type').val();
    var input = $('.search-text').val();
    if (type === 'name') {
      socket.emit('name search',input);
    } else if (type === 'ingredients') {
      socket.emit('ingredients search',input);
    }
    setTimeout(function(){$('.search-text').val("");},1000);
  })
  $('.fa-search').click(function(e){
    $(document).trigger('search');
  });
  $('.bottle').on('click','.find',function(){
    $('.main-content').empty();
    var skill = $('#skill').val();
    var taste = $('#taste').val();
    var occasion = $('#occasion').val();
    var color = $('#color').val();
    arr=[skill,taste,occasion,color];
    socket.emit('find',arr);
    setTimeout(function(){$('.bottle').find('select').val('0');},1000);
  });
  $('.main-content').on('click','.list',function(){
    searchResult = $('.main-content').children();
    var id = $(this).attr('id');
    $('.main-content').empty();
    socket.emit('result',id);
  });
  $('.main-content').on('click','.back',function(){
    $('.main-content').empty().append(searchResult);
  });
});