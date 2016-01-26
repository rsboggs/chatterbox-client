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


//User Input Field

var userInput = function () {
  var username = $('[name="username"]').val();
  var text = $('[name="message"]').val();
  var roomname = $('[name="room"]').val();
  var obj = {};
  obj.username = username;
  obj.text = text;
  obj.roomname = roomname;
  return obj;
};




//Fetch Methods

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

var rooms = [];

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
      url: 'https://api.parse.com/1/classes/chatterbox?limit=1000',
      type: 'GET',
      // data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        var messages = data.results;
        // console.log(messages);
        for(var i = 0; i < messages.length; i++) {
          $('#chats').prepend('<div>' + escaper(data.results[i]['username']) + ": " + escaper(data.results[i]['text']) + '</div>');
          if (rooms.indexOf(escaper(data.results[i]['roomname'])) === -1 && escaper(data.results[i]['roomname']).length < 40) {
            rooms.push(escaper(data.results[i]['roomname']));
          }
        }
        for (var j = 0; j < rooms.length; j++) {
          $("select").prepend('<option>' + rooms[j] + '</option>');
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
