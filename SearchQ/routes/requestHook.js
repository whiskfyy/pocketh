var daoFactory = require("../dao/daoFactory");
var log = require('../utils/logger');
var dao = daoFactory.customerDao();
var accessInfoDao = daoFactory.accessInfoDao();

module.exports = {
		before : 
			function(req, res, next){
				log.app.info(req.url + " request start");
				var isNoAuth = false;
				
				config.NO_AUTH.forEach(function(val,index,ar){
					log.app.debug(req.url);
					if (req.url.startsWith(val)){
						   isNoAuth = true;
						   return;
					   }
					});
				if (!isNoAuth){
					var data = {};
					data['access_key'] = req.body.access_key;
					if (data['access_key']){
						accessInfoDao.checkAccessKey(data, function(result, err){
							if (err){
								res.json({
									"res" : config.RES.AUTH_ERROR
								});
								return;
							} else {
								if (result == false){
									res.json({
										"res" : config.RES.AUTH_ERROR
									});
									return;
								} else {
									log.app.info("auth ok");
									next();
								}
								
							}
						});						
					} else {
						res.json({
							"res" : config.RES.AUTH_ERROR
						});
						return;
					}
				} else {
					next();
				}
				
			}
		,
		after :
			function (req, res, next){
				var log = require('../utils/logger');
				log.app.info(req.url + " request end");
				//next();
			}
}