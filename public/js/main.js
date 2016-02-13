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

var bindEvents = function() {
	//bind events (click, hover, etc)
	var $roomBox = $('.room-description');
	$roomBox.on('click', function() {
		$('#lobby').css('display', 'none'); //should have a loader
		$('#game-room').fadeIn();
		GameManager.setRoom($(this).attr('id'));
	});

	//bind tootltips, if any
	$('.tooltipster').tooltipster();
};




//scripts to run after the page has finished loading
$(function() {
	console.log("Ready.");
	bindEvents();
});