/**
 * http://usejsdoc.org/
 */
var log = require('../../utils/logger');
var mongo = require("./db").mongo;
var dburl = require("./db").dburl;
function hospitalDao(){
	
}
function sortLocation(lat, lng){
	return function(a, b) {
		return Math.sqrt(Math.pow((lat) - a.lat, 2) + Math.pow((lng) - a.lng, 2)) 
				- Math.sqrt(Math.pow((lat) - b.lat, 2) + Math.pow((lng) - b.lng, 2));
    }
	 
}
hospitalDao.prototype.getListNear = function(data, callback){
	mongo.connect(dburl, function(err, db) {
		var minLat = (data['lat']*1000000  - config.LAT_100 * data['range']) / 1000000;
		var maxLat = (data['lat']*1000000  + config.LAT_100 * data['range']) / 1000000;
		var minLng = (data['lng']*1000000  - config.LNG_100 * data['range']) / 1000000;
		var maxLng = (data['lng']*1000000  + config.LNG_100 * data['range']) / 1000000;
		log.app.debug('hospitalDao.getListNear: minLat=' + minLat + ',maxLat=' + maxLat + ',minLng=' + minLng + ',maxLng=' + maxLng + ',range=' + data['range']);
		if(err) {
			log.app.error('hospitalDao.getListNear db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		db.collection('hospital').find({lat:{'$gte':minLat, '$lte':maxLat}, lng:{'$gte':minLng, '$lte':maxLng}})
			.toArray(function(err, result) {
            	if(err) {
					log.app.error('hospitalDao.getListNear query error.', err);
					callback(null, err);
				} else {
					if (result != null && result.length > 0){
						log.app.debug(result.length);
						var res = result.sort(sortLocation(data['lat'], data['lng'])).slice(0, parseInt(data['limit']));
						callback(res, null);
					} else {
						callback(null, null);
					}						
				}
                db.close();
              });
	});	
}

hospitalDao.prototype.getListByName = function(data, callback){
	mongo.connect(dburl, function(err, db) {
		log.app.debug('hospitalDao.getListByName: name=' + data['hname']);
		if(err) {
			log.app.error('hospitalDao.getListByName db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}		
		db.collection('hospital').find({name: {'$regex': data['hname']}})
			.sort({name:1})
			.limit(parseInt(data['limit']))
			.toArray(function(err, result) {
					
					if(err) {
						log.app.error('hospitalDao.getListByName query error.', err);
						callback(null, config.RES.DB_ERROR);
					} else {
						if (result != null && result.length > 0){
							log.app.debug(result.length);
							callback(result, null);
						} else {
							callback(null, null);
						}						
					}
					db.close();
				});		
	});	
}

hospitalDao.prototype.getListByAddress = function(data, callback){
	mongo.connect(dburl, function(err, db) {
		log.app.debug('hospitalDao.getListByAddress: address=' + data['address']);
		if(err) {
			log.app.error('hospitalDao.getListByAddress db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		db.collection('hospital').find({address: {'$regex': data['address']}})
		.sort({name:1})
			.limit(parseInt(data['limit']))
			.toArray(function(err, result) {
					if(err) {
						log.app.error('hospitalDao.getListByAddress query error.', err);
						callback(null, config.RES.DB_ERROR);
					} else {
						if (result != null && result.length > 0){
							log.app.debug(result.length);
							callback(result, null);
						} else {
							callback(null, null);
						}					
					}
					db.close();
				});		
	});	
}

hospitalDao.prototype.getListByMix = function(data, callback){
	mongo.connect(dburl, function(err, db) {
		log.app.debug('hospitalDao.getListByMix: address=' + data['address']);
		if(err) {
			log.app.error('hospitalDao.getListByMix db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		var cond = {};
		
		if (data['lat']){
			var minLat = (data['lat']*1000000  - config.LAT_100 * data['range']) / 1000000;
			var maxLat = (data['lat']*1000000  + config.LAT_100 * data['range']) / 1000000;			
			cond["lat"] = {'$gte': minLat, '$lte': maxLat};
			log.app.debug('hospitalDao.getListByMix: Lat=' + minLat + "~" + maxLat);
		}		
		if (data['lng']){
			var minLng = (data['lng']*1000000  - config.LNG_100 * data['range']) / 1000000;
			var maxLng = (data['lng']*1000000  + config.LNG_100 * data['range']) / 1000000;
			cond["lng"] = {'$gte': minLng, '$lte': maxLng};
			log.app.debug('hospitalDao.getListByMix: Lng=' + minLng + "~" + maxLng);
		}
					
		if (data['hname']){
			cond["name"] = {'$regex': data['hname']};
		}
			
		if (data['address']){
			cond["address"] = {'$regex': data['address']};
		}
		if (data['dept']){
			cond["dept"] = {'$regex': data['dept']};
			log.app.debug('hospitalDao.getListByMix: dept=' + data["dept"]);
		}
		
		if(err) {
			log.app.error('hospitalDao.getListByMix db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		db.collection('hospital').find(cond)
		.toArray(function(err, result) {
           	if(err) {
				log.app.error('hospitalDao.getListByMix query error.', err);
				callback(null, err);
			} else {
				if (result != null && result.length > 0){
					log.app.debug(result.length);
					var res = result.sort(sortLocation(data['lat'], data['lng'])).slice(0, parseInt(data['limit']));
					callback(res, null);
				} else {
					callback(null, null);
				}						
			}
               db.close();
         	});
	});
}

hospitalDao.prototype.getDetail = function(data, callback){
	mongo.connect(dburl, function(err, db) {
		log.app.debug('hospitalDao.getDetail: _id=' + data['_id']);
		if(err) {
			log.app.error('hospitalDao.getDetail db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}		
		db.collection('hospital').find({name: {'$regex': data['hname']}})
			.sort({name:1})
			.limit(parseInt(data['limit']))
			.toArray(function(err, result) {
					
					if(err) {
						log.app.error('hospitalDao.getListByName query error.', err);
						callback(null, config.RES.DB_ERROR);
					} else {
						if (result != null && result.length > 0){
							log.app.debug(result.length);
							callback(result, null);
						} else {
							callback(null, null);
						}						
					}
					db.close();
				});		
	});	
}

module.exports = new hospitalDao();
