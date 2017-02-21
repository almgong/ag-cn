var pg = require('pg');
pg.defaults.ssl = true;
var DATABASE_URI = process.env.DATABASE_URI;

/**
 *	Item model file that exports functionality for accessing database records
 *	related to players (items for now will be accessed here as well).
 *
 *	table(s) is/are in form:
 *		player: create table player(id, name, experience, hp, ac)	// will include all stats later
 *		owns_item: create table owns_item(player.id, item.id)
 *		item: create table item(id, item_name, damage)
**/

// TODO