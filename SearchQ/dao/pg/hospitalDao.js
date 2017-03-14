/**
 * http://usejsdoc.org/
 */
var log = require('../../utils/logger');
var pool = require("./db");
function hospitalDao(){
	
}

hospitalDao.prototype.getListNear = function(data, callback){
	pool.connect(function(err, client, done) {
		var minLat = data['lat'] * 1000000 - config.LAT_100 * data['range'];
		var maxLat = data['lat'] * 1000000 + config.LAT_100 * data['range'];
		var minLng = data['lng'] * 1000000 - config.LNG_100 * data['range'];
		var maxLng = data['lng'] * 1000000 + config.LNG_100 * data['range'];
		log.app.debug('hospitalDao.getListNear: minLat=' + minLat + ',minLng=' + minLng + ',range=' + data['range']);
		if(err) {
			log.app.error('hospitalDao.getListNear db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		
		client.query('select * from hospital h join hospital_location l ON h.id=l.hospital_id '
				+ ' WHERE l.lat>=$1 AND l.lat<=$2 AND l.lng>=$3 AND l.lng<=$4 '
				+ ' ORDER BY sqrt(power(l.lat-$5,2) + power(l.lng-$6,2))'
				+ ' LIMIT $7'
				, [
				   	minLat
				   	,maxLat
				   	,minLng
				   	,maxLng
				   	,data['lat'] * 1000000
				   	,data['lng'] * 1000000
				   	,data['limit']
				]
				, function(err, result) {
					done();
					if(err) {
						log.app.error('hospitalDao.getListNear query error.', err);
						callback(null, err);
					} else {
						if (result.rowCount > 0){
							callback(result.rows, null);
						} else {
							callback(null, null);
						}						
					}
				});		
	});	
}

hospitalDao.prototype.getListByName = function(data, callback){
	pool.connect(function(err, client, done) {
		log.app.debug('hospitalDao.getListByName: name=' + data['hname']);
		if(err) {
			log.app.error('hospitalDao.getListByName db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		
		client.query('select * from hospital '
				+ ' WHERE name like $1 '
				+ ' ORDER BY name'
				+ ' LIMIT $2'
				, [ '%' + data['hname'] + '%'
				   	,data['limit']
				]
				, function(err, result) {
					done();
					if(err) {
						log.app.error('hospitalDao.getListByName query error.', err);
						callback(null, config.RES.DB_ERROR);
					} else {
						if (result.rowCount > 0){
							callback(result.rows, null);
						} else {
							callback(null, null);
						}						
					}
				});		
	});	
}

hospitalDao.prototype.getListByAddress = function(data, callback){
	pool.connect(function(err, client, done) {
		log.app.debug('hospitalDao.getListByAddress: address=' + data['address']);
		if(err) {
			log.app.error('hospitalDao.getListByAddress db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		
		client.query('select * from hospital '
				+ ' WHERE address like $1 '
				+ ' ORDER BY address'
				+ ' LIMIT $2'
				, [ '%' + data['address'] + '%'
				   	,data['limit']
				]
				, function(err, result) {
					done();
					if(err) {
						log.app.error('hospitalDao.getListByAddress query error.', err);
						callback(null, config.RES.DB_ERROR);
					} else {
						if (result.rowCount > 0){
							callback(result.rows, null);
						} else {
							callback(null, null);
						}						
					}
				});		
	});	
}

hospitalDao.prototype.getListByMix = function(data, callback){
	pool.connect(function(err, client, done) {
		log.app.debug('hospitalDao.getListByMix: address=' + data['address']);
		if(err) {
			log.app.error('hospitalDao.getListByMix db connect error.', err);
			callback(null, config.RES.DB_ERROR);
			return;
		}
		var cond = [];
		var val = [];
		var i = 0;
		if (data['lat']){
			cond[i] = ' l.lat>=$' + (i+1) ;
			cond[i +1] = ' l.lat<=$' + (i+2);
			val[i] = data['lat'] * 1000000 - config.LAT_100 * data['range'];
			val[i+1] = data['lat'] * 1000000 + config.LAT_100 * data['range'];
			i = i + 2;
		}		
		if (data['lng']){
			cond[i] = ' l.lng>=$' + (i+1);
			cond[i+1] = ' l.lng<=$' + (i+2);
			val[i] = data['lng'] * 1000000 - config.LNG_100 * data['range'];
			val[i+1] = data['lng'] * 1000000 + config.LNG_100 * data['range'];
			i = i + 2;
		}
				
		if (data['hname']){
			cond[i] = ' name like $' + (i+1);
			val[i] = '%' + data['hname'] + '%';
			i = i + 1
		}
		
		if (data['address']){
			cond[i] = ' address like $' + (i+1);
			val[i] = '%' + data['address'] + '%';
			i = i + 1;
		}
		
		if (data['dept']){
			var dept = data['dept'].split('|');
			log.app.debug(dept.join());
			var n = [];
			var j = 0;
			dept.forEach(function(v, index, ar){
				n[j] = j + (i+1);
				val[i+j] = v;
				j = j + 1;
			});
			log.app.debug(n.join());
			cond[i] = ' id in (select hospital_id from hospital_dept where dept_no in ($' + n.join(',$') + '))';
			i = i + j;
		}
		
		var limitStr = ' LIMIT $' + (i+1);
		val[i] = data['limit'];
		
		log.app.debug('cond=' + cond.join(' AND '));
		log.app.debug('val=' + val.join(','));
		
		client.query('select * from hospital h join hospital_location l ON h.id=l.hospital_id '
				+ ' WHERE '
				+ cond.join(' AND ')
				+ limitStr
				//+ ' ORDER BY name'
				, val
				, function(err, result) {
					done();
					if(err) {
						log.app.error('hospitalDao.getListByMix query error.', err);
						callback(null, config.RES.DB_ERROR);
					} else {
						if (result.rowCount > 0){
							callback(result.rows, null);
						} else {
							callback(null, null);
						}						
					}
				});		
	});	
}

module.exports = new hospitalDao();
