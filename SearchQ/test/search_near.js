var express = require('express');
var router = express.Router();
var log = require('../utils/logger');

/* GET home page. */
router.get('/', function(req, res, next) {
	var request = require('request');
	var options = {
		uri: config.TEST_URL +  '/app/search/near',
		method: 'POST',
		auth: {
		    'user': config.AUTH.user,
		    'pass': config.AUTH.pass
		  },
		form: {
			access_key: req.query.k,
			lat: req.query.lat,
			lng: req.query.lng,
			range: req.query.range,
			limit: req.query.limit
		}
	};
	
	request(options, function (error, response, body) {
		if (!error) {
			res.send(body);
		} else {
			log.app.debug("error:" + error );
			next(error);
		}
	});	
});

module.exports = router;