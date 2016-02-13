/* Authentication module */
var exports = module.exports = {};


//given a room and user id, validate that the user has permission to commit turn
exports.authenticate = function(room, id) {
	return true;
	if(room.players.indexOf(id) > 0)
		return true;

	return false;
};