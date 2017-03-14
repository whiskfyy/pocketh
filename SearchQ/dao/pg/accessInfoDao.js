/**
 * http://usejsdoc.org/
 */
var log = require('../../utils/logger');
var pool = require("./db");
function accessInfoDao(){
	
}

accessInfoDao.prototype.checkPermission = function(data, callback){
	var new_access_key = uuid.v4();
	pool.connect(function(err, client, done) {
		log.app.debug('accessInfoDao.checkPermission:' + data);
		if(err) {
			log.app.error('accessInfoDao.checkPermission db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		
		client.query('UPDATE access_info SET access_key=$3,last_access_dt=now() WHERE access_key=$1 AND (now() - last_access_dt)<=$2'
				, [
				   	data['access_key']
					, config.ACTIVE_TIME_LIMIT
					, new_access_key
				]
				, function(err, result) {
					done();
					if(err) {
						log.app.error('accessInfoDao.checkPermission query error.', err);
						callback(null, null, config.RES.DB_ERROR);
					} else {
						if (result.rowCount < 1){
							callback(false, null, null);
						} else {
							callback(true, new_access_key, null);
						}						
					}
				});		
	});	
}

accessInfoDao.prototype.checkAuth = function(data, callback){
	var uuid = require('node-uuid');
	var access_key = uuid.v4();
	pool.connect(function(err, client, done) {
		log.app.debug('accessInfoDao.checkAuth:' + data);
		if(err) {
			log.app.error('accessInfoDao.checkAuth db connect error.', err);
			callback(null, err);
			return;
		}
		
		client.query("UPDATE access_info SET access_key=$1,last_access_dt=now() WHERE auth_key=$2 AND pgp_sym_decrypt(password,'orderQ')=$3"
				, [
				   	access_key
					, data['auth_key']
				   	, data['password']
				]
				, function(err, result) {
					done();
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
				});		
	});	
}
module.exports = new accessInfoDao();
