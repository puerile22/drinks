var arr;
$(document).ready(function(){
  var socket = io();
  $('.fa-random').click(function(e){
    socket.emit('random',function(){
    });
  });
  $('.search-text').keypress(function(e){
      var key = e.which;
      if (key === 13) {
        $(document).trigger('search');
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
    setTimeout(function(){$('.search-text').val("");},2000);
  })
  $('.fa-search').click(function(e){
    $(document).trigger('search');
  });
  $('.bottle').on('click','.find',function(){
    var skill = $('#skill').val();
    var taste = $('#taste').val();
    var occasion = $('#occasion').val();
    var color = $('#color').val();
    arr=[skill,taste,occasion,color];
    socket.emit('find',arr);
    setTimeout(function(){$('.bottle').find('select').val('0');},2000);
  });
});