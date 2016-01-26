//Escaped Characters

var escapeCharacters = {
  '&': '&amp;', 
  '<': '&lt;',
  '>': '&gt;',
  '\"': '&quot;',
  '\'': '&#x27;',
  '/': '&#x2F;'
};

//Escape invalid characters

var escaper = function (message) {
  if(message === undefined) {
    return 'undefined';
  } else if (message === null) {
    return 'null';
  }
  var arr = message.split('');
  for(var j = 0; j<arr.length; j++) {
      if(escapeCharacters[arr[j]]) {
        arr[j] = escapeCharacters[arr[j]];
      }
    }
  return arr.join('');
};

//User Input Field

var userInput = function () {
  var obj = {
    username: $('[name="username"]').val(),
    text: $('[name="message"]').val(),
    roomname: $('[name="room"]').val() 
  }
  return obj;
};

//App
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox?limit=1000',
  rooms: [],
  friends: [],
  init: function() {},
  send: function(message) {
    $.ajax({
      url: app.server,
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
  fetch: function(roomname) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      // data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        var messages = data.results;
        
        // If fetch is called with roomname, this filters messages array to room matches
        if (roomname !== undefined) {
          messages = _.filter(messages, function(item) {
            return item.roomname === roomname;
          });
        }
        //call external fetch function with messages parameter
        for(var i = 0; i < messages.length; i++) {
          app.addMessage(messages[i]);
          app.addRoom(messages[i]);
        }
        
        //Event Handling
        eventHandling();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      } 
    });
  },
  clearMessages: function() {
    $('#chats').children().remove();
  },
  addMessage: function(message) {
    $('#chats').append('<div><span>' + escaper(message['username']) + "</span>: " + escaper(message['text']) + '</div>');
  },
  addRoom: function(message) {
    if (app.rooms.indexOf(escaper(message['roomname'])) === -1 && escaper(message['roomname']).length < 40) {
      app.rooms.push(escaper(message.roomname));
      $("select").prepend('<option>' + escaper(message.roomname) + '</option>');
    }
  },
  addFriend: function(friendName) {
    if (app.friends.indexOf(friendName) === -1) {
      app.friends.push(friendName);
    }
  }
};

//Event handling functions called from within Fetch method
var eventHandling = function () {
  $(document.body).on('change', 'select', function() {
    var selectedRoom = $('select').val();
    app.clearMessages();
    app.fetch(selectedRoom);
  });
  $(document.body).on('click', 'span', function() {
    app.addFriend($(this).html());
  });
}

//Call app to load initial messages
app.fetch();


