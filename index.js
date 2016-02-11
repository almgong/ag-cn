var appPath = "/";
var viewPath = "/views";

var express = require('express');
var app = express();
var path  = require('path');
var fs = require('fs');

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


/** API for room logic **/
var room1 = {
	numPlayers:0,
	turn: 0,		//binary, 0 is one team, 1 is the other
	players: [],	//contains array of client side hash ID, only clients with this hash can authorize moves
	status: 'Open',
	board:{}
};
var room2 = {
	numPlayers:0,
	turn: 0,		//binary, 0 is one team, 1 is the other
	players: [],	//contains array of client side hash ID, only clients with this hash can authorize moves
	status: 'Open',
	board:{}
};
var room3 = {
	numPlayers:0,
	turn: 0,		//binary, 0 is one team, 1 is the other
	players: [],	//contains array of client side hash ID, only clients with this hash can authorize moves
	status: 'Open',
	board:{}
};

var testRoom = {
	numPlayers:0,
	turn: 0,		//binary, 0 is one team, 1 is the other
	players: [],	//contains array of client side hash ID, only clients with this hash can authorize moves
	status: 'Open',
	board: [		//4x5 board (20 elements total)
		[{'word':'elephant', 'color': null}, {'word':'elephant', 'color': 0}, {'word':'elephant', 'color': 0}, {'word':'elephant', 'color': 0}, {'word':'elephant', 'color': 0}], 
		[{'word':'elephant', 'color': 0},{'word':'elephant', 'color': 0},{'word':'elephant', 'color': 0},{'word':'elephant', 'color': 0},{'word':'elephant', 'color': 0}], 
		[{'word':'elephant', 'color': 0},{'word':'elephant', 'color': 0},{'word':'elephant', 'color': 0},{'word':'elephant', 'color': 0},{'word':'elephant', 'color': 0}], 
		[{'word':'elephant', 'color': 0},{'word':'elephant', 'color': 0},{'word':'elephant', 'color': 0},{'word':'elephant', 'color': 0},{'word':'elephant', 'color': 0}]]
};


app.get('/', function(request, response) {

	//set up underscore, though for now we won't use it
	fs.readFile('./views/pages/index.html',{encoding: 'utf-8'}, function(err, html) {
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

/* to get current room information for a given room */
app.get('/board/all/:room', function(request, response) {

	//param must be room-1, room-2, room-3
	var info = null;
	switch(request.params.room) {
		case "room-1":
			info = room1;
			break;
		case "room-2":
			info = room2;
			break;
		case "room-3":
			info=room3;
			break;
		default:
			console.log("What???");
			info = "{'error'}"

	}
	response.json(info);

});

//returns the board state (=the state of the cards)
app.get('/board/state/:room', function(req, res) {

	var info = null;
	switch(req.params.room) {
		case "room-1":
			info = room1.board;
			break;
		case "room-2":
			info = room2.board;
			break;
		case "room-3":
			info = room3.board;
			break;
		case "test":
			info = testRoom.board;
			break;
		default:
			console.log("What???");
			info = "{'error'}"

	}
	res.json(info);

});


//return a test room for testing purposes
app.get('/test', function(req, res) {
	res.json(testRoom);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


