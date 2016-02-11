/**
 * Main client-side manager javascript file for CodeNames. Only need one file since all content is
 * in the same HTML page.
**/

var loader = {}; 	//loader that manages loading animations
loader.start = function() {
	//start a loading animation
};
loader.stop = function() {
	//stop loading animation(s)
};


var gameManager = {};	//acts as the CLIENT side manager for a current game
gameManager.player = null;
gameManager.generateUserHash = function() {
	//generate a unique id for this client
};
gameManager.setPlayer = function() {
	//set player (0 or 1)
};



var bindEvents = function() {
	//bind events (click, hover, etc)
	var $roomBox = $('.room-description');
	$roomBox.on('click', function() {
		console.log('el/')
		$('#lobby').css('display', 'none'); //should have a loader
		$('#game-room').fadeIn();
	});
};




//scripts to run after the page has finished loading
$(function() {
	console.log("ready");
	bindEvents();
});