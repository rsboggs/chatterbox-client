var escapeCharacters = {
  '&': '&amp;', 
  '<': '&lt;',
  '>': '&gt;',
  '\"': '&quot;',
  '\'': '&#x27;',
  // ' ': '',
  // '`': '',
  // '!': '',
  // '@': '',
  // '$': '',
  // '%': '',
  // '(': '',
  // ')': '',
  // '=': '',
  // '+': '',
  '{': 'curly bracket',
  '}': 'curly bracket',
  // '[': '',
  // ']': '',
  '/': '&#x2F;'
};


var escaper = function (message) {
  if(message === undefined) {
    return 'undefined';
  }
  var arr = message.split('');
  for(var j = 0; j<arr.length; j++) {
      if(escapeCharacters[arr[j]]) {
        arr[j] = escapeCharacters[arr[j]];
      }
    }
    return arr.join('');
};

var app = {
  init: function() {},
  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      } 
    });
  },
  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      // data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        var messages = data.results;
        for(var i = 0; i<messages.length; i++) {
          $('#chats').append('<div>' + escaper(data.results[i]['text']) + '</div>');
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      } 
    });
  }
};

app.fetch();
