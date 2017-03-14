var daoFactory = require("../dao/daoFactory");
var log = require('../utils/logger');
var dao = daoFactory.customerDao();
var accessInfoDao = daoFactory.accessInfoDao();

function userAction(){
	
}
// ユーザRegister
userAction.prototype.doRegister = function (req, res){
	validationRegister(req);
	var errors = req.validationErrors();
	if (errors) {
		res.json({
			"res" : config.RES.PARAM_ERROR
		});
		return;
	}	  
	var data = {};
	data['name'] = req.body.name;
	data['name_kana'] = req.body.name_kana;
	data['birthday'] = req.body.birthday;
	data['sex'] = req.body.sex;
	data['occupation'] = req.body.occupation;
	var result = dao.insertOne(data, function(result, err){
		log.app.debug("result=" + result + ", err=" + err);
		if (err){
			res.json({
				"res" : err
			});
		} else {
			res.json({
				"res" : config.RES.NORMAL,
				"auth_key" : result
			});
		}
	});
}

//Register時入力チェック
function validationRegister(req){
	req.checkBody({
		 'name': {
		    notEmpty: true,
		    isLength: {
		    	options:[{ max: 20 }],
		    	errorMessage: '20文字以内で入力してください。'
		    },
		    errorMessage: 'Invalid name'
		  },
		  'name_kana': {
			    notEmpty: true,
			    isLength: {
			    	options:[{ max: 50 }],
			    	errorMessage: '50文字以内で入力してください。'
			    },
			    errorMessage: 'Invalid name_kana'
			  },
		  'birthday': {
		    notEmpty: true,
		    matches: {
		    	options: [/^[0-9]{4}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}$/],
		    	errorMessage: 'YYYYMMDDのフォーマットの日付を入力してください。'
		    },
		    errorMessage: 'Invalid birthday' 
		  },			  
		  'sex': { //
			matches: {
		      options: [/^[0-2]{1}$/],
		      errorMessage: '正しい値を入力してください。' // Error message for the validator, takes precedent over parameter message
		    },
		    errorMessage: 'Invalid sex'
		  },
		  'occupation': { //
			  notEmpty: true,
			  matches: {
				  options: [/^[0-6]$/],
			      errorMessage: '正しい値を入力してください。' // Error message for the validator, takes precedent over parameter message
			  },
			  errorMessage: 'Invalid occupation'
		  } 
	});
}



//ユーザRegister確認
userAction.prototype.doConfirm = function (req, res){
	validationConfirm(req);
	var errors = req.validationErrors();
	if (errors) {
		res.json({
			"res" : config.RES.PARAM_ERROR
		});
		return;
	}	  
	var data = {};
	data['auth_key'] = req.body.auth_key;
	data['password'] = req.body.password;
	dao.confirmOne(data, function(result, err){
		log.app.debug("result=" + result + ", err=" + err);
		if (err){
			res.json({
				"res" : err
			});
		} else {
			res.json({
				"res" : config.RES.NORMAL,
				"access_key": result
			});
		}
	});
}

//Register時入力チェック
function validationConfirm(req){
	req.checkBody({
		'auth_key': {
		    notEmpty: true,
		    matches: {
		    	options: [/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/]
		    },
		    errorMessage: 'Invalid auth key' 
		  },
		'password': {
			notEmpty: true,
			isLength: {
				options:[{ max: 16 }],
			  	errorMessage: '16文字以内で入力してください。'
			},
			errorMessage: 'Invalid password'
		}
	});
}


//access_key確認
userAction.prototype.checkPermission = function (req, res){
	validationPermission(req);
	var errors = req.validationErrors();
	if (errors) {
		res.json({
			"res" : config.RES.PARAM_ERROR
		});
		return;
	}	  
	var data = {};
	data['access_key'] = req.body.access_key;
	accessInfoDao.checkPermission(data, function(result, new_access_key, err){
		log.app.debug("result=" + result + ", err=" + err);
		if (err){
			res.json({
				"res" : err
			});
		} else {
			res.json({
				"res" : config.RES.NORMAL,
				"new_access_key" : new_access_key,
				"hasPermission": result
			});
		}
	});
}

//access_key確認時入力チェック
function validationPermission(req){
	req.checkBody({
		'access_key': {
		    notEmpty: true,
		    matches: {
		    	options: [/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/]
		    },
		    errorMessage: 'Invalid access　key' 
		  }
	});
}

//ログイン認証
userAction.prototype.auth = function (req, res){
	validationAuth(req);
	var errors = req.validationErrors();
	if (errors) {
		res.json({
			"res" : config.RES.PARAM_ERROR
		});
		return;
	}	  
	var data = {};
	data['auth_key'] = req.body.auth_key;
	data['password'] = req.body.password;
	log.app.debug('auth_key=' + data['auth_key'] + ',password=' + data['password']);
	accessInfoDao.checkAuth(data, function(result, err){
		log.app.debug("result=" + result + ", err=" + err);
		if (err){
			res.json({
				"res" : err
			});
		} else {
			res.json({
				"res" : config.RES.NORMAL,
				"access_key": result
			});
		}
	});
}

//ログイン認証時入力チェック
function validationAuth(req){
	req.checkBody({
		'auth_key': {
		    notEmpty: true,
		    matches: {
		    	options: [/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/]
		    },
		    errorMessage: 'Invalid access　key' 
		  },
		'password': {
			notEmpty: true,
			isLength: {
				options:[{ max: 16 }],
			  	errorMessage: '16文字以内で入力してください。'
			},
			errorMessage: 'Invalid password'
		}
	});
}

module.exports = new userAction();
