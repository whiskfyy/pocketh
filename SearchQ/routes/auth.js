var express = require('express');
var router = express.Router();
var log = require('../utils/logger');

var action = require('../action/userAction');

/* GET users listing. */
router.post('/', function(req, res, next) {
	action.auth(req, res);
});

router.post("/check", function(req, res, next){
	action.checkPermission(req, res);
});

module.exports = router;