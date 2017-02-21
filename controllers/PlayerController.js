var playerModel = require('../models/Player.js');

/**
 * Controller for mediating access to Player DB records.
**/

exports.getPlayer = function(playerId, next) {
	var cb = function(playerInDb) {
		var playerObj = null;

		// if not null, organize data in a form that both DAO and routes expect
		if (playerInDb) {
			var player = playerInDb[0];
			var playerObj = {
				"name": player.name,
				"experience": player.experience,
				"hp": player.hp,
				"ac": player.ac,
				"level": player.level,
				"id": player.id
			};

			next(playerObj);
		}
	};

	playerModel.getPlayer(playerId, cb);
};

exports.getPlayerAndItems = function(playerId, next) {
	var cb = function(playerAndItems) {
		console.log(playerAndItems)
	};

	playerModel.getPlayerAndItems(playerId, cb);
};

// saves the player object that is expected to have
// the same fields as the objects returned by
// getPlayer(). If any fields are null/undefined they
// are not persisted to the database
exports.savePlayer = function(player, next) {
	var cb = function() {};
	playerModel.savePlayer(player, cb);
};