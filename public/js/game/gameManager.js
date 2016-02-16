/* Module for the client side game manager */

var GameManager = (function() {

	//returns a hashCode used for user ID
	var hashCode = function(str){
	    var hash = 0;
	    if (str.length == 0) return hash;
	    for (i = 0; i < str.length; i++) {
	        char = str.charCodeAt(i);
	        hash = ((hash<<5)-hash)+char;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    return hash;
	};

	var getRowCol = function(ele) {
		//returns the row and column in form "#-#" for the given ele 
		//expects id=col/row-# for the current and parent
		var row = $(ele).parents('.game-row').attr('data-id')[4];
		return ""+row+"-"+$(ele).attr('data-id')[4];
	};

	var gameManager = {};	//acts as the CLIENT side manager for a current game
	gameManager.team = null;		//either 0 or 1
	gameManager.intervalID = null;	//based on interval setting
	gameManager.userHash = null;	//unique hash for user
	gameManager.updatesThisTurn=[];
	gameManager.room = null;
	gameManager.currentRoom = null;	//a ReactObject instance, see window.ReactObject
	gameManager.generateUserHash = function() {
		//generate a unique id for this client
		gameManager.userHash = hashCode("" + gameManager.team + Date.now());
	};
	gameManager.setPlayer = function(team) {
		//set player (0 or 1)
		if(team==0 || team==1 || team==null)
			gameManager.team = team;
	};
	gameManager.setRoom = function(roomID) {
		gameManager.room = roomID;
		gameManager.enterRoom();	//register entry into the room
	};
	gameManager.reset = function() {
		//resets client state
		gameManager.setPlayer(null);
		gameManager.updatesThisTurn = [];
		$('div.game-card').removeClass('team-0 team-1 updated');
		$('.choose-team-btn').removeClass('disabled');
		if(gameManager.intervalID)
			clear(gameManager.intervalID);
		gameManager.userHash = gameManager.generateUserHash();

	};
	gameManager.enterRoom = function() {
		if(gameManager.currentRoom)
			gameManager.currentRoom.destroy();	//destroy any resources from previous room, if any

		gameManager.currentRoom = new window.ReactObject("/board/state/"+gameManager.room,
		 $('#game-room-body')[0]);

		//api code to register user into the room server-wise TODO
	};
	gameManager.bindEvents = function() {
		//binds any game related events
		gameManager.generateUserHash();		//set unique id for this user, only called once

		//when a card is clicked
		$('.game-card').on('click', function() {
			$(this).toggleClass('team-' + gameManager.team).toggleClass('updated');
		});


		//button events//

		//bind a refresh on board
		$('#reset-board').on('click', function() {
			$.ajax({
				url:'/board/refresh/'+gameManager.room,
				success:function() {
					gameManager.reset();	//reset client
				},
				error:function() {

				}
			});
		});
		//when end turn is clicked
		$('#end-turn').on('click', function() {
			var $updated = $('.updated');	//all updated elements this turn, note .updated class is auto-removed by react rendering
			$(this).addClass('disabled').text('loading...');
			$.each($updated, function(i, ele) {
				gameManager.updatesThisTurn.push(getRowCol(ele));
			});
			var cb = function() {	//callback
				gameManager.updatesThisTurn = []; //clear current turn updates
				$.each($updated, function(i, ele) {
					//for each updated card this turn, reveal spymaster solution
					var text = $(ele).text();
					$(ele).html("<div class='spymaster-outline team-"+ 
						$(ele).attr('data-owner') + "'>" + text + "</div>");
				});
			};
			
			ApiClient.commitTurn(gameManager.updatesThisTurn, gameManager.room, 
				gameManager.userHash, gameManager.team, cb);
		});
		//spymaster button clicked, reveal answers
		$('#spymaster-btn').on('click', function() {
			var $cards = $('.game-card');
			var owner, word;
			$cards.each(function(i) {
				word = $(this).text();
				owner = $(this).attr('data-owner');
				$(this).html("<div class='spymaster-outline team-" + owner + 
					"'>" + word + "</div>");
			});
		});
	}

	return {
		client: gameManager,
		setTeam: gameManager.setPlayer,
		setRoom: gameManager.setRoom,
		init: gameManager.bindEvents,
		reset:gameManager.reset
	};
})();