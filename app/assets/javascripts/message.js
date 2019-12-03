$(function(){

  function buildHTML(message){
    if (message.content) {
      var content = `<p class="lower-message__content">
                     ${message.content}
                   </p>`
    } else {
      var content = ``
    }
    if (message.image) {
      var img = `<img src=${message.image} >`
    } else {
      var img = ``
    }
    var html = `<div class="message" data-message_id=${message.id}>
                  <div class="upper-message">
                    <div class="upper-message__user-name">
                      ${message.user_name}
                    </div>
                    <div class="upper-message__date">
                      ${message.created_at}
                    </div>
                  </div>
                  <div class="lower-message">
                    ${content}
                    ${img}
                  </div>
                </div>`
    return html;
  };

  $('.new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,  
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(message){
      var html = buildHTML(message);
      $('.messages').append(html)
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
      $('form')[0].reset();
      $('.form__submit').prop('disabled', false);
    })
    .fail(function(){
      alert("メッセージ送信に失敗しました");
    });
    return false;
  })
  var reloadMessages = function() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
      last_message_id = $(".message:last").data('message_id');
      s = location.href
      result = s.split("/");
      $.ajax({
        url: `/groups/${result[4]}/api/messages`,
        type: 'get',
        dataType: 'json',
        data: {id: last_message_id}
      })
      .done(function(messages) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.messages').append(insertHTML);
        $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
      })
      .fail(function() {
        alert('error');
      });
    };
  }
  setInterval(reloadMessages, 7000);
});