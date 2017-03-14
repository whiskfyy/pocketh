/**
 * http://usejsdoc.org/
 */
var config = JSON.parse(require('fs').readFileSync('config.json'));
var mongo = require('mongodb').MongoClient
var dburl = config.MONGODB_URL;
module.exports = {
	mongo,
	dburl
}