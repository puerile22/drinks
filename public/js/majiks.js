var arr;
var source = $('#search-result').html();
var template = Handlebars.compile(source);
var sourceSingle = $('#single-recipe').html();
var templateSingle = Handlebars.compile(sourceSingle);
var h,searchResult;
var socket = io();
socket.on('search result',function(input){
  $('.container').prepend('<h1>Search Result</h1>');
  var n = 12;
  if (input.length<12 && input.length !== 0) {
    n = input.length;
  } else if (input.length === 0){
    $('.container').append('<h2>No results found! Please try again.</h2>');
    return; 
  } 
  for (var i =0;i<n;i++) {
    h = template(input[i]);
    $('.container').append(h);
  }
});

socket.on('single recipe',function(input){
  if (input.videos[0].type === 'assets') {
    input.video = input.videos[1].video;
  } else {
    input.video = input.videos[0].video;
  }
  h = templateSingle(input);
  $('.container').append(h);
});

socket.on('random recipe',function(input){
  input.video = input.videos[0].video;
  h = templateSingle(input);
  $('.container').append(h);
  $('.container').find('.back').remove();
});

socket.on('top recipe',function(input){
  $('.container').prepend('<h1>Top Drinks</h1>');
  var array=[];
  for(var i = 0;i<9;i++) {
    var j = Math.floor(Math.random()*input.length);
    array.push(input.splice(j,1));
    h = template(array[i][0]);
    $('.container').append(h);
  }
});

$(document).ready(function(){
  $('a').click(function(e){
    var id = $(this).find('.list').trigger('click');
  });
  if ($('#type').val()==='name') {
      $('.search-text').val("search drink recipes");
    } else {
      $('.search-text').val("search recipes by ingredients");
    }
  $('.search-text').css('color','grey');
  $('.fa-random').click(function(e){
    $('.container').empty();
    socket.emit('random',function(){
    });
  });
  $('.search-text').keypress(function(e){
      var key = e.which;
      if (key === 13) {
        $(document).trigger('search');
        $('.container').empty();
      }
    });
  $(document).on('search',function(){
    $('.container').empty();
    var type = $('#type').val();
    var input = $('.search-text').val();
    if (type === 'name') {
      socket.emit('name search',input);
    } else if (type === 'ingredients') {
      socket.emit('ingredients search',input);
    }
    if ($('#type').val()==='name') {
      $('.search-text').val("search drink recipes");
    } else {
      $('.search-text').val("search recipes by ingredients");
    }
    $('.search-text').css('color','grey');
  });

  $('.fa-search').click(function(e){
    $(document).trigger('search');
  });
  $('.bottle').on('click','.find',function(){
    $('.container').empty();
    var skill = $('#skill').val();
    var taste = $('#taste').val();
    var occasion = $('#occasion').val();
    var color = $('#color').val();
    arr=[skill,taste,occasion,color];
    socket.emit('find',arr);
  });
  $('.container').on('click','.list',function(){
    searchResult = $('.container').children();
    var id = $(this).attr('id');
    $('.container').empty();
    socket.emit('result',id);
  });
  $('.container').on('click','.back',function(){
    $('.container').empty().append(searchResult);
  });
  $('.search-text').focus(function(){
    if ($('.search-text').val() === 'search drink recipes' || $('.search-text').val() === "search recipes by ingredients") {
      $('.search-text').val("");
      $('.search-text').css('color','white');
    }
  })
  $('.search-text').focusout(function(e){
    if ($('#type').val()==='name') {
      $('.search-text').val("search drink recipes");
    } else {
      $('.search-text').val("search recipes by ingredients");
    }
      $('.search-text').css('color','grey');
    });
});