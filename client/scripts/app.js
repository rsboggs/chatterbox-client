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

var escaper = function (text) {
  if(text === undefined) {
    return 'undefined';
  } else if (text === null) {
    return 'null';
  }
  var arr = text.split('');
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
      data: 'order=-createdAt',
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
          if(valid(messages[i])) {
          app.addMessage(messages[i]);
          app.addRoom(messages[i]);   
          }
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
  allMessages: {},
  addMessage: function(message) {
    // if(app.allMessages[escaper(message.username)] !== escaper(message.text)) {
    if (app.friends.indexOf(escaper(message.username)) !== -1) {
      $('#chats').append('<div class="message friended"><span class="username">' + escaper(message['username']) 
        + "</span> " + escaper(message['text']) + '<span class="time">' + moment.utc(timeHandler(message)).local().fromNow() +'</span> </div>');
    } else {
      $('#chats').append('<div class="message"><span class="username">' + escaper(message['username']) 
        + "</span> " + escaper(message['text']) + '<span class="time">' + moment.utc(timeHandler(message)).local().fromNow() +'</span> </div>');
    }
      // app.allMessages[escaper(message.username)] = escaper(message.text);
    // }
  },
  addRoom: function(message) {
    if (app.rooms.indexOf(escaper(message['roomname'])) === -1 && escaper(message['roomname']).length < 40) {
      app.rooms.push(escaper(message.roomname));
      $("select").prepend('<option>' + escaper(message.roomname) + '</option>');
    }
  },
  currentRoom: undefined,
  addFriend: function(friendName) {
    if (app.friends.indexOf(friendName) === -1) {
      app.friends.push(friendName);
      app.clearMessages();
      app.fetch(app.currentRoom);
    }
  }
};

//handles createdAt time string
var timeHandler = function (message) {
  //format : 2016-01-26T03:22:57.864Z
  var time = message.createdAt;
  var year = time.substring(0, 4);
  var month = time.substring(5, 7) - 1;
  var day = time.substring(8, 10);
  var hour = time.substring(11, 13);
  var minute = time.substring(14, 16);
  var second = time.substring(17, 19);
  return [year, month, day, hour, minute, second];
}

//check message validity
var valid = function(message) {
  if(escaper(message.text).length > 200) {
    return false;
  } else if(escaper(message.text) === 'undefined') {
    return false;
  } else if(escaper(message.username) === 'undefined') {
    return false;
  }
  return true;
}

//Event handling functions called from within Fetch method
var eventHandling = function () {
  $(document.body).on('change', 'select', function() {
    var selectedRoom = $('select').val();
    app.currentRoom = selectedRoom;
    app.clearMessages();
    app.fetch(selectedRoom);
  });
  $(document.body).on('click', 'span.username', function() {
    app.addFriend($(this).html());
  });
}

//Call app to load initial messages
app.fetch();


