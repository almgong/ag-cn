var pg = require('pg');
pg.defaults.ssl = true;
var DATABASE_URL = process.env.DATABASE_URL;

/**
 *	Player model file that exports functionality for accessing database records
 *	related to players (items for simplicity will be accessed here as well).
 *  All model functions will return raw records, and the controllers should do
 *	any further filtering/organization, unless specified otherwise.
 *
 *	table(s) is/are in form:
 *		player: create table player(id, name, experience, hp, ac)	// will include all stats later
 *		owns_item: create table owns_item(player.id, item.id)
 *		item: create table item(id, item_name, damage)
**/

// GET

exports.getPlayer = function(playerId, next) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) {
			console.log("Error in connecting to DB (getPlayer)...");
			next(null);
			return;
		}


		var q = "select * from player where id=" + playerId + ";";
		client.query(q, function(err, result) {
			done();
			if (err) {
				console.log("Error in retrieiving player...");
				next(null);
				return;
			}	
			
			next(((result.rowCount > 0) ? result.rows : null));
		});
	});
};

exports.getItemsForPlayer = function(playerId, next) {

};

exports.getItem = function(itemId, next) {

};

/**
 * Commonly, users want both the player + item info as one.
 * This is really just a convenience wrapper using getPlayer
 * and getItem
**/
exports.getPlayerAndItems = function(playerId, next) {

};

// STORE

// saves a potentially updated player object, ignoring (i.e. not updating)
// any fields that are undefined or null.
exports.savePlayer = function(player, next) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) {
			console.log("Error in connecting to DB (savePlayer)...");
			next(null);
			return;	// these return statements are needed if the controllers do not return something (stops logic here)
		}

		var q = "update player set";
		q += ((player.name) ? " name='" + player.name + "'," : ""); 
		q += ((player.experience) ? " experience=" + player.experience + "," : "");
		q += ((player.hp) ? " hp=" + player.hp + "," : "");  
		q += ((player.ac) ? " ac=" + player.ac + "," : ""); 
		q += ((player.level) ? " level=" + player.level + "," : ""); 
		q = q.substring(0, q.length-1);		// remove trailing comma
		q += (" where id=" + player.id);	// last line in query
		
		// make the query
		client.query(q, function(err) {
			done();
			if (err) {
				console.log("Error in saving player...");
				next();
				return;
			}

			next();	// notify caller that operation has completed
		});
	});
};



