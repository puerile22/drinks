var arr;









$(document).ready(function(){
  var socket = io();
  $('.fa-random').click(function(e){
    //e.preventDefault();
    socket.emit('random',function(){
      console.log('ab');
    });
  });

  $('.fa-search').click(function(e){
    event.preventDefault();
    var type = $('#type').val();
    var input = $('.search-text').val();
    if (type === 'name') {
      console.log(input);
      console.log(type);
      socket.emit('name search',input);
    } else if (type === 'ingredients') {
      socket.emit('ingredients search',input);
    }
    setTimeout(function(){$('.search-text').val("");},2000);
  });
  $('.bottle').on('click','.find',function(){
    var skill = $('#skill').val();
    var taste = $('#taste').val();
    var occasion = $('#occasion').val();
    var color = $('#color').val();
    arr=[skill,taste,occasion,color];
    socket.emit('find',arr);
    setTimeout(function(){$('.bottle').find('select').val('0');},2000);
  })


});