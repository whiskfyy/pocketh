var express = require('express');
var router = express.Router();
var log = require('../utils/logger');

/* GET home page. */
router.get('/', function(req, res, next) {
	var request = require('request');
	log.app.debug("k=" + req.query.k);
	var options = {
		uri: config.TEST_URL +  '/app/user_register/confirm',
		method: 'POST',
		auth: {
		    'user': config.AUTH.user,
		    'pass': config.AUTH.pass
		  },
		form: {
			auth_key: req.query.k,
			password: req.query.p
		}
	};
	
	request(options, function (error, response, body) {
		if (!error) {
			res.send(body);
		} else {
			log.app.debug("error:" + error );
		}
	});	
});

module.exports = router;