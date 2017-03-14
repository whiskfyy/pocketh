/**
 * http://usejsdoc.org/
 */
var log = require('../../utils/logger');
var mongo = require("./db").mongo;
var dburl = require("./db").dburl;
function accessInfoDao(){
	
}

accessInfoDao.prototype.checkPermission = function(data, callback){
	var uuid = require('node-uuid');
	var new_access_key = uuid.v4();
	mongo.connect(dburl, function(err, db) {
		log.app.debug('accessInfoDao.checkPermission:' + data);
		if(err) {
			log.app.error('accessInfoDao.checkPermission db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		var access_dt_limit = new Date();
		access_dt_limit.setDate(access_dt_limit.getDate() - config.ACTIVE_TIME_LIMIT_DAY);
		log.app.debug(access_dt_limit);
		db.collection('access_info').updateOne(
				{access_key:data['access_key'], last_access_dt:{ "$gte" : access_dt_limit}}, 
				{$set: {access_key: new_access_key, last_access_dt:new Date()}}, 
				function(err, result) {
					if(err) {
						log.app.error('accessInfoDao.checkPermission query error.', err);
						callback(null, null, config.RES.DB_ERROR);
					} else {
						if (result.rowCount < 1){
							log.app.debug("accessInfoDao.checkPermission: no result!");
							callback(false, null, null);
						} else {
							log.app.debug("accessInfoDao.checkPermission: has result!" + new_access_key);
							callback(true, new_access_key, null);
						}						
					}
					db.close();
				}
		);
	});	
}

accessInfoDao.prototype.checkAuth = function(data, callback){
	var uuid = require('node-uuid');
	var access_key = uuid.v4();
	mongo.connect(dburl, function(err, db) {
		log.app.debug('accessInfoDao.checkAuth:' + data);
		if(err) {
			log.app.error('accessInfoDao.checkAuth db connect error.', err);
			callback(null, err);
			return;
		}
		db.collection('access_info').updateOne(
				{auth_key:data['auth_key'], password:data['password']}, 
				{$set: {access_key: access_key, last_access_dt:new Date()}}, 
				function(err, result) {
					if(err) {
						log.app.error('accessInfoDao.checkAuth query error.', err);
						callback(null, err);
					} else {
						log.app.debug(result);
						if (result.rowCount < 1){
							callback(null, new Error('invalid password'));
						} else {
							callback(access_key, null);
						}						
					}
					db.close();
				}
		);
	});	
}

accessInfoDao.prototype.checkAccessKey = function(data, callback){
	mongo.connect(dburl, function(err, db) {
		log.app.debug('accessInfoDao.checkAccessKey:' + data);
		if(err) {
			log.app.error('accessInfoDao.checkAccessKey db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		var access_dt_limit = new Date();
		access_dt_limit.setDate(access_dt_limit.getDate() - config.ACTIVE_TIME_LIMIT_DAY);
		log.app.debug(access_dt_limit);
		db.collection('access_info').updateOne(
				{access_key:data['access_key'], last_access_dt:{ "$gte" : access_dt_limit}}, 
				{$set: {last_access_dt:new Date()}}, 
				function(err, result) {
					if(err) {
						log.app.error('accessInfoDao.checkAccessKey query error.', err);
						callback(null, config.RES.DB_ERROR);
					} else {
						if (result.rowCount < 1){
							log.app.debug("accessInfoDao.checkAccessKey: no result!");
							callback(false,  null);
						} else {
							log.app.debug("accessInfoDao.checkAccessKey: has result!");
							callback(true, null);
						}						
					}
					db.close();
				}
		);
	});	
}
module.exports = new accessInfoDao();
