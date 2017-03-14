var express = require('express');
var router = express.Router();
var log = require('../utils/logger');

var action = require('../action/hospitalAction');


router.post("/near", function(req, res, next){
	action.doSearch("near", req, res);
});

router.post("/name", function(req, res, next){
	action.doSearch("name", req, res);
});

router.post("/address", function(req, res, next){
	action.doSearch("address", req, res);
})

router.post("/mix", function(req, res, next){
	action.doSearch("mix", req, res);
})

module.exports = router;