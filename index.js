var appPath = "/";
var viewPath = "/views";

var express = require('express');
var app = express();
var path  = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var game = require('./lib/game.js');
var auth = require('./lib/auth/auth.js');

// socket.io
var http = require('http').Server(app);
var io = require("socket.io")(http);
var dndIO = io.of("/dnd")

app.set('port', (process.env.PORT || 5000));

//static
app.use('/static', express.static(__dirname + appPath + 'public'));
app.use(express.static('public'));

//set up underscore + html rendering
var cons = require('consolidate');
var u = require('underscore'); //use 'u' to prevent name conflicts
app.engine('html', cons.underscore);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, viewPath));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.get('/', function(request, response) {

	//set up underscore, though for now we won't use it
	fs.readFile('./views/pages/index.html',{encoding: 'utf-8'}, function(err, html) {
		if(err) {
			throw err;
		}

		response.send(html);
	});
});


/** DnD **/

var enemies = [];	// current set of enemies (good for people who have joined intermittently)

app.get('/dnd', function(request, response) {

	//set up underscore, though for now we won't use it
	fs.readFile('./views/pages/dnd.html',{encoding: 'utf-8'}, function(err, html) {
		if(err) {
			throw err;
		}

		response.send(html);
	});
});

app.get('/test2', function(req, res) {
	res.json(chat);
});

// chat
app.get('/dnd/chat/:offset', function(request, response) {
	response.json(chat.slice(request.params.offset, chat.length));	// send relevant part of chat
});

app.post('/dnd/chat', function(req, res) {
	if (chat.length == 0) {
		chat.push(req.body);
	} else {
		// iteratively look at array to find the correct spot
		for (var i = chat.length-1; i >=0; i--) {
			if (req.body.messageTimestamp > chat[i].messageTimestamp) {
				// this is where it belongs
				//chat.splice(i+1, 0, req.body);	// this is with reordering
				chat.push(req.body);				// tina's laptop has wrong time @@@@@@
				break;
			}
		}
	}

	res.send("OK");
});

// dice related
app.get('/dnd/dice', function(request, response) {
	// users will roll dice themselves, and this call is for everyone to grab the result
	response.json(dice);
});

app.post('/dnd/dice', function(req, res) {
	// expcets {diceType:x, rollValue:x} 
	dice = req.body;
});

// enemy/character related
app.get('/dnd/enemy', function(req, res) {
	res.json(enemies);
});

app.post('/dnd/enemy', function(req, res) {
	enemies = req.body;	// simple, just tell server what you want the enemies to be, but in str since we cant send arrays
});

// endpoint to get ALL state (to avoid multiple requests)  - EDIT really just enemies now
app.get('/dnd/all/:chat_offset', function(req, res) {
	var respObj = {};
	//respObj.dice = dice;
	//respObj.chatMessages = chat.slice(req.params.chat_offset, chat.length);
	respObj.enemies = enemies;
	
	res.json(respObj);
});


// NEW socket.io implementation of real-time DnD services (eliminates client polling)
// client implementations should take note of the custom events declared here
var players = {};	// {{ name:"", stats:{} },...}
dndIO.on("connection", function(socket) {

	// event: disconnect (AUTO)
	socket.on("disconnect", function() {
		
		// notify client chat boxes that player has left
		if (players[socket.id]) {
			socket.broadcast.emit("chat", [{"message":"[Server] " + players[socket.id].name + " has logged off."}]);	
			delete players[socket.id];		// remove player from map
		}
	});

	socket.on("join", function(playerObj) {
		players[socket.id] = playerObj;
		dndIO.emit("chat", [{"message":"[Server] " + playerObj.name + " has joined the channel!"}]);
	});	

	// event: chat - when server receives this, means a new message available to broadcast, 
	// when clients receive this, that means a new message is to be drawn
	socket.on("chat", function(message) {
		socket.broadcast.emit("chat", message);		// broadcast to all EXCEPT sender
	});

	// event: dice - when server receives this, means a new dice roll has just occurred (so broadcast it)
	// when clients receive this, that means a new dice roll is to be drawn
	socket.on("dice", function(dice) {
		socket.broadcast.emit("dice", dice);
	}); 

	// event: enemies update = when server receives this, a new array of enemies to broadcast
	// when clients receive this, that means a new list to draw
	socket.on("enemies update", function(enemiesUpdated) {
		enemies = enemiesUpdated;
		socket.broadcast.emit("enemies update", enemiesUpdated);
	});
});

// setInterval(function() {
// 	dndIO.emit("players", players);	// every 5 seconds, notify people of current players
// }, 5000);



/** CodeNames **/

/** API for room logic **/
var room1 = {
	numPlayers:0,
	turn: 0,		//binary, 0 is one team, 1 is the other
	players: [],	//contains array of client side hash ID, only clients with this hash can authorize moves
	status: 'Open',
	board:game.generateBoard()
};
var room2 = {
	numPlayers:0,
	turn: 0,		//binary, 0 is one team, 1 is the other
	players: [],	//contains array of client side hash ID, only clients with this hash can authorize moves
	status: 'Open',
	board:game.generateBoard()
};
var room3 = {
	numPlayers:0,
	turn: 0,		//binary, 0 is one team, 1 is the other
	players: [],	//contains array of client side hash ID, only clients with this hash can authorize moves
	status: 'Open',
	board:game.generateBoard()
};

var testRoom = {
	numPlayers:0,
	turn: 0,		//binary, 0 is one team, 1 is the other
	players: [],	//contains array of client side hash ID, only clients with this hash can authorize moves
	status: 'Open',
	board: game.generateBoard() //4x5 board
};

function getRoom(room) {
	var info = null;
	switch(room) {
		case "room-1":
			info = room1;
			break;
		case "room-2":
			info = room2;
			break;
		case "room-3":
			info=room3;
			break;
		case "test":
			info = testRoom;
			break;
		default:
			console.log("What???");
			info = "{'error'}"

	}
	return info;
}

app.get('/codenames', function(request, response) {

	//set up underscore, though for now we won't use it
	fs.readFile('./views/pages/codenames.html',{encoding: 'utf-8'}, function(err, html) {
		if(err) {
			throw err;
		}

		//fs.readFile('./views/includes/') can nest more of these and pass into template below

		var template = u.template(html);
		response.send(template({
			'r1Status':room1.status, 
			'r2Status': room2.status, 
			'r3Status':room3.status,
			'r1NumPlayers': room1.numPlayers,
			'r2NumPlayers': room2.numPlayers,
			'r3NumPlayers': room3.numPlayers}));
	});

});

/* to get current room information for a given room, moreso for debugging */
app.get('/board/all/:room', function(request, response) {

	//param must be room-1, room-2, room-3

	response.json(getRoom(request.params.room));

});

//returns the board state (=the state of the cards)
app.get('/board/state/:room', function(req, res) {
	
	res.json(getRoom(req.params.room).board);

});

//resets the board for the given room, must be sent by a user in room, change to post
app.get('/board/refresh/:room', function(req, res) {
	var room = getRoom(req.params.room);
	room.board = game.generateBoard();
	res.send("ok");

});

app.post('/commit/turn', function(req, res) {
	//commit a turn
	
	var room = getRoom(req.body.room);
	if(!auth.authenticate(room, req.body.user) || req.body.updates==undefined 
		||req.body.updates.length==0) {
		res.send("ok");	
		return;	//don't update board, invalid user
	}

	room.board = game.updateBoard(room.board, req.body.updates, req.body.team);
	res.send("ok");

});

//return a test room for testing purposes
app.get('/test', function(req, res) {
	res.json(testRoom);
});

// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });

http.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


