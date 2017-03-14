var express = require('express');
var router = express.Router();
var log = require('../utils/logger');

/* GET home page. */
router.get('/', function(req, res, next) {
	var request = require('request');
	var options = {
		uri: config.TEST_URL + '/app/auth/check',
		method: 'POST',
		auth: {
		    'user': config.AUTH.user,
		    'pass': config.AUTH.pass
		  },
		form: {
			access_key: req.query.k
		}
	};
	
	request(options, function (error, response, body) {
		if (!error) {
			res.send(body);
		} else {
			log.app.debug("error:" + error);
		}
	});	
});

module.exports = router;