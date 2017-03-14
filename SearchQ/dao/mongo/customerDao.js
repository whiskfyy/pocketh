/**
 * http://usejsdoc.org/
 */
var log = require('../../utils/logger');
var mongo = require("./db").mongo;
var dburl = require("./db").dburl;
function customerDao(){
	
}
//新規ユーザ（未確認）
customerDao.prototype.insertOne = function(data, callback){
	var uuid = require('node-uuid');
	var auth_key = uuid.v4();
	mongo.connect(dburl, function(err, db) {
		log.app.debug('customerDao.insertOne:' + data);
		if(err) {
			log.app.error('customerDao.insertOne db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		db.collection('customer').insertOne(
				{
					'name':data['name'],
					'name_kana':data['name_kana'],
					'birthday':data['birthday'],
					'sex':data['sex'],
					'occupation':data['occupation'],
					'auth_key':auth_key,
					'mod_flg':1
				},
				function(err, r){
					if(err) {
						log.app.error('customerDao.insertOne query error.', err);
						callback(null, config.RES.DB_ERROR);
					} else {
						callback(auth_key, null);
					}
					db.close();
		});			
	});	
}

//新規ユーザ確認（パスワード、認証キーなどの設定）
customerDao.prototype.confirmOne = function(data, callback){
	mongo.connect(dburl, function(err, db) {
		log.app.debug('customerDao.confirmOne:' + data['auth_key']);
		if(err) {
			log.app.error('customerDao.confirmOne db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		db.collection('customer').updateOne(
			{auth_key:data['auth_key'], mod_flg:1}, 
			{$set: {mod_flg: 0}}, 
			function(err, result) {
				if(err) {
					done();
					log.app.error('customerDao.confirmOne query error.', err);
					callback(null, config.RES.DB_ERROR);	
					db.close();
				} else {
					if (result.modifiedCount == 1){
						log.app.debug(result);
						var uuid = require('node-uuid');
						var access_key = uuid.v4();
						db.collection('access_info').insertOne(
							{
								'auth_key':data['auth_key'],
								'password':data['password'],
								'birthday':data['birthday'],
								'sex':data['sex'],
								'occupation':data['occupation'],
								'access_key':access_key,
								'last_access_dt':new Date()
							},
							function(err, r){
								if(err) {
									log.app.error('customerDao.confirmOne query error.', err);
									callback(null, config.RES.DB_ERROR);
								} else {
									log.app.debug(result);
									callback(access_key, null);
								}
								db.close();
							});
					} else {
						log.app.error('未承認ユーザが存在しません.');
						callback(null, config.RES.NO_DATA_ERROR);
						db.close();
					}
				}	
			});		
	});	
}

module.exports = new customerDao();
