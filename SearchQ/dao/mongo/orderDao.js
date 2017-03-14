/**
 * http://usejsdoc.org/
 */
var log = require('../../utils/logger');
var mongo = require("./db").mongo;
var dburl = require("./db").dburl;
function orderDao(){
	
}

orderDao.prototype.getDetail = function(data, callback){
	mongo.connect(dburl, function(err, db) {
		log.app.debug('orderDao.getDetail: minLat=' + minLat + ',maxLat=' + maxLat + ',minLng=' + minLng + ',maxLng=' + maxLng + ',range=' + data['range']);
		if(err) {
			log.app.error('hospitalDao.getListNear db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		db.collection('hospital').find({lat:{$gte:minLat, $lte:maxLat}, lng:{$gte:minLng, $lte:maxLng}})
			.toArray(function(err, result) {
            	if(err) {
					log.app.error('hospitalDao.getListNear query error.', err);
					callback(null, err);
				} else {
					if (result != null && result.length > 0){
						log.app.debug(result.length);
						var res = result.sort(sortLocation, data['lat'], data['lng']).slice(0, parseInt(data['limit']));
						callback(res, null);
					} else {
						callback(null, null);
					}						
				}
                db.close();
              });
	});	
}