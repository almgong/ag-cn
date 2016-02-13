/* API Client, should be used for any and all non-react.js API calls */

var ApiClient = (function() {

	var api = {};

	api.commitTurn = function(updatesArr, roomID, userHash, team) {
		//tells server that the user has committed his turn and should update
		var turnData = {
			updates: updatesArr,
			room:roomID,
			user:userHash,
			team: team
		};
		console.log(JSON.stringify(turnData));
		$.ajax({
			url:'/commit/turn',
			method:'POST',
			data:turnData,
			success:function(d) {
				console.log("success commit");
				$('#end-turn').removeClass('disabled').text('End Turn');
			},
			error:function() {
				console.log("Error in commit");
			}
		});
	};

	return {
		commitTurn:api.commitTurn
	};

})();