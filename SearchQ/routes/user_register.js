/**
 * http://usejsdoc.org/
 */

var express = require('express');
var router = express.Router();
var log = require('../utils/logger');

var action = require('../action/userAction');

/* GET users listing. */
router.get('/', function(req, res, next) {
	//dao.getData();
	res.send('user_register!');
});

router.post("/register", function(req, res, next){
	action.doRegister(req, res);
});

router.post("/confirm", function(req, res, next){
	action.doConfirm(req, res);
})

module.exports = router;