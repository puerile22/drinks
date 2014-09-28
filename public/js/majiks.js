var arr;
var source = $('#search-result').html();
var template = Handlebars.compile(source);
var sourceSingle = $('#single-recipe').html();
var templateSingle = Handlebars.compile(sourceSingle);
var h,searchResult;
var socket = io();
socket.on('search result',function(input){
  for (var i =0;i<10;i++) {
    h = template(input[i]);
    $('.main-content').append(h);
  }
});

socket.on('single recipe',function(input){
  h = templateSingle(input);
  console.log(h);
  $('.main-content').append(h);
});

$(document).ready(function(){
  $('.fa-random').click(function(e){
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
  $('.main-content').on('click','img',function(){
    searchResult = $('.main-content').children();
    var id = $(this).attr('id');
    $('.main-content').empty();
    console.log(id);
    socket.emit('result',id);
  });

});