var daoFactory = require("../dao/daoFactory");
var log = require('../utils/logger');
var dao = daoFactory.hospitalDao();
var accessInfoDao = daoFactory.accessInfoDao();

function hospitalAction(){
	
}
// ユーザRegister
hospitalAction.prototype.doSearch = function (type, req, res){
	switch(type){
	case "near":
		doSearchNear(req, res);
		break;
	case "name":
		doSearchByName(req, res);
		break;
	case "address":
		doSearchByAddress(req, res);
		break;
	case "mix":
		doSearchMix(req, res);
		break;
	}
}

function doSearchNear(req, res){
	validationSearchNear(req);
	var errors = req.validationErrors();
	if (errors) {
		res.json({
			"res" : config.RES.PARAM_ERROR
		});
		return;
	}	  
	var data = {};
	data['lat'] = req.body.lat;
	data['lng'] = req.body.lng;
	data['range'] = req.body.range;
	data['limit'] = req.body.limit;
	dao.getListNear(data, function(result, err){
		log.app.debug("result=" + result + ", err=" + err);
		if (err){
			res.json({
				"res" : err
			});
		} else {
			res.json({
				"res" : config.RES.NORMAL,
				"list": result
			});
		}
	});
}

//Register時入力チェック
function validationSearchNear(req){
	req.checkBody({
		 'lat': {
		    notEmpty: true,
		    matches: {
		    	options: [/^[0-9]{0,3}[.]{0,1}[0-9]{0,6}$/],
		    	errorMessage: '正しい緯度を入力してください。'
		    },
		    errorMessage: '無効な緯度'
		  },
		  'lng': {
			  notEmpty: true,
			    matches: {
			    	options: [/^[0-9]{0,3}[.]{0,1}[0-9]{0,6}$/],
			    	errorMessage: '正しい経度を入力してください。'
			    },
			    errorMessage: '無効な経度'
			  },
		  'range': {
		    notEmpty: true,
		    matches: {
		    	options: [/^(5)|(10)|(30)|(100)$/],
		    	errorMessage: '正しい範囲を入力してください。'
		    },
		    errorMessage: '無効な範囲' 
		  },			  
		  'limit': { //
			matches: {
		      options: [/^\d{1,2}$/],
		      errorMessage: '正しい件数を入力してください。' // Error message for the validator, takes precedent over parameter message
		    },
		    errorMessage: '無効な件数'
		  }
	});
}

function doSearchByName(req, res){
	validationSearchByName(req);
	var errors = req.validationErrors();
	if (errors) {
		res.json({
			"res" : config.RES.PARAM_ERROR
		});
		return;
	}	  
	var data = {};
	data['hname'] = req.body.hname;
	data['limit'] = req.body.limit;
	dao.getListByName(data, function(result, err){
		log.app.debug("result=" + result + ", err=" + err);
		if (err){
			res.json({
				"res" : err
			});
		} else {
			res.json({
				"res" : config.RES.NORMAL,
				"list": result
			});
		}
	});
}

//Register時入力チェック
function validationSearchByName(req){
	req.checkBody({
		 'hname': {
		    notEmpty: true,
		    errorMessage: '無効な名称'
		  },
		  'limit': { //
			matches: {
		      options: [/^\d{1,2}$/],
		      errorMessage: '正しい件数を入力してください。' // Error message for the validator, takes precedent over parameter message
		    },
		    errorMessage: '無効な件数'
		  }
	});
}

function doSearchByAddress(req, res){
	validationSearchByAddress(req);
	var errors = req.validationErrors();
	if (errors) {
		res.json({
			"res" : config.RES.PARAM_ERROR
		});
		return;
	}	  
	var data = {};
	data['address'] = req.body.address;
	data['limit'] = req.body.limit;
	dao.getListByAddress(data, function(result, err){
		log.app.debug("result=" + result + ", err=" + err);
		if (err){
			res.json({
				"res" : err
			});
		} else {
			res.json({
				"res" : config.RES.NORMAL,
				"list": result
			});
		}
	});
}

//Register時入力チェック
function validationSearchByAddress(req){
	req.checkBody({
		 'address': {
		    notEmpty: true,
		    errorMessage: '無効な住所'
		  },
		  'limit': { //
			matches: {
		      options: [/^\d{1,2}$/],
		      errorMessage: '正しい件数を入力してください。' // Error message for the validator, takes precedent over parameter message
		    },
		    errorMessage: '無効な件数'
		  }
	});
}

function doSearchMix(req, res){
	//validationSearchMix(req);
	var errors = req.validationErrors();
	if (errors) {
		res.json({
			"res" : config.RES.PARAM_ERROR
		});
		return;
	}	  
	var data = {};
	data['lat'] = req.body.lat;
	data['lng'] = req.body.lng;
	data['range'] = req.body.range;	
	data['hname'] = req.body.hname;	
	data['address'] = req.body.address;	
	data['dept'] = req.body.dept;
	data['limit'] = req.body.limit;
	data['dept'] = req.body.dept;
	
	dao.getListByMix(data, function(result, err){
		log.app.debug("result=" + result + ", err=" + err);
		if (err){
			res.json({
				"res" : err
			});
		} else {
			res.json({
				"res" : config.RES.NORMAL,
				"list": result
			});
		}
	});
}

//Register時入力チェック
function validationSearchMix(req){
	req.checkBody({
		 'dept': {
		    notEmpty: false,
		    errorMessage: '無効な科目'
		  },
		  'limit': { //
			matches: {
		      options: [/^\d{1,2}$/],
		      errorMessage: '正しい件数を入力してください。' // Error message for the validator, takes precedent over parameter message
		    },
		    errorMessage: '無効な件数'
		  }
	});
}

module.exports = new hospitalAction();
