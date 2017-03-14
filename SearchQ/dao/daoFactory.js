"use strict";
/**
 * http://usejsdoc.org/
 */
var log = require('../utils/logger');
var t;
function daoFactory(){
	var config = JSON.parse(require('fs').readFileSync('config.json'));
	this.t = config.DBTYPE;
}

daoFactory.prototype.setType = function(t){
	this.t = t;	
}
daoFactory.prototype.customerDao = function(){
	var dao = require("./" + this.t + "/customerDao");
	log.app.info("./" + this.t + "/customerDao" + " be loading");
	return dao;
}

daoFactory.prototype.accessInfoDao = function(){
	var dao = require("./" + this.t + "/accessInfoDao");
	log.app.info("./" + this.t + "/accessInfoDao" + " be loading");
	return dao;
}

daoFactory.prototype.hospitalDao = function(){
	var dao = require("./" + this.t + "/hospitalDao");
	log.app.info("./" + this.t + "/hospitalAction" + " be loading");
	return dao;
}
module.exports = new daoFactory();