var express = require('express');
var router = express.Router();
var log = require('../utils/logger');

/* GET home page. */
router.get('/', function(req, res, next) {
	var request = require('request');
	var options = {
		//uri: 'http://localhost:' + (process.env.PORT || '3000') + '/app/user_register/register',
			uri: config.TEST_URL + '/app/user_register/register',
		method: 'POST',
		auth: {
		    'user': config.AUTH.user,
		    'pass': config.AUTH.pass
		  },
		form: {
			name: "田中　太郎",
			name_kana: 'たなか　たろう',
			birthday: '19780129',
			sex: 0,
			occupation: 2			
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