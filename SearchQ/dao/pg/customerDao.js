/**
 * http://usejsdoc.org/
 */
var log = require('../../utils/logger');
var pool = require("./db");
function customerDao(){
	
}

customerDao.prototype.insertOne = function(data, callback){
	var uuid = require('node-uuid');
	var auth_key = uuid.v4();
	pool.connect(function(err, client, done) {
		log.app.debug('customerDao.insertOne:' + data);
		if(err) {
			log.app.error('customerDao.insertOne db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		
		client.query('INSERT INTO customer (name, name_kana,birthday,sex,occupation, auth_key) values($1, $2, $3, $4, $5, $6)'
				, [
				   	data['name']
					, data['name_kana']
					, data['birthday']
					, data['sex']
					, data['occupation']
					, auth_key
				]
				, function(err, result) {
					done();
					if(err) {
						log.app.error('customerDao.insertOne query error.', err);
						callback(null, config.RES.DB_ERROR);
					} else {
						callback(auth_key, null);
					}
				});		
	});	
}

customerDao.prototype.confirmOne = function(data, callback){
	pool.connect(function(err, client, done) {
		log.app.debug('customerDao.confirmOne:' + data['auth_key']);
		if(err) {
			log.app.error('customerDao.confirmOne db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		
		client.query('UPDATE customer set mod_flg=0 where auth_key = $1 and mod_flg=1' 
				, [
				   	data['auth_key']
				]
				, function(err, result) {					
					if(err) {
						done();
						log.app.error('customerDao.confirmOne query error.', err);
						callback(null, config.RES.DB_ERROR);						
					} else {
						if (result.rowCount == 1){
							log.app.debug(result);
							var uuid = require('node-uuid');
							var access_key = uuid.v4();
							client.query("INSERT INTO access_info (auth_key,password,access_key,last_access_dt) values($1,pgp_sym_encrypt($2,'orderQ'),$3,now())"
									,[
								  data["auth_key"],
								  data['password'],
								  access_key
								  ]
								,function(err,result){
									done();
									if(err) {
										log.app.error('customerDao.confirmOne query error.', err);
										callback(null, config.RES.DB_ERROR);
									} else {
										log.app.debug(result);
										callback(access_key, null);
									}				
								})
						} else {
							done();
							log.app.error('未承認ユーザが存在しません.');
							callback(null, config.RES.NO_DATA_ERROR);
						}
					}					
				});		
	});	
}

module.exports = new customerDao();
