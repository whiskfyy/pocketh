require('dotenv').load();
var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var basicAuth = require('basic-auth-connect');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var logger = require('./utils/logger');

var routes = require('./routes/index');
var users = require('./routes/users');
var user_register = require('./routes/user_register');
var auth = require('./routes/auth');
var search = require('./routes/search');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

config = JSON.parse(require('fs').readFileSync('config.json'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(log4js.connectLogger(logger.syslog));

logger.app.info('Entering cheese testing');

//app.use(express.bodyParser());
app.use(expressValidator({
	  errorFormatter: function(param, msg, value) {
	      var namespace = param.split('.')
	      , root    = namespace.shift()
	      , formParam = root;

	    while(namespace.length) {
	      formParam += '[' + namespace.shift() + ']';
	    }
	    return {
	      param : formParam,
	      msg   : msg,
	      value : value
	    };
	  }
	}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Basic認証
app.use('/app/*', basicAuth(config.AUTH.user, config.AUTH.pass));

//TODO：　request hook
app.use(require('./routes/requestHook').before);

app.use('/', routes);
app.use('/users', users);
app.use('/app/user_register', user_register);
app.use('/app/auth', auth);
app.use('/app/search', search);

//test code
app.use('/test/addCustomer', require('./test/addCustomer'));
app.use('/test/confirmCustomer', require('./test/confirmCustomer'));
app.use('/test/checkPermission', require('./test/checkPermission'));
app.use('/test/auth', require('./test/auth'));
app.use('/test/search_near', require('./test/search_near'));
app.use('/test/search_name', require('./test/search_name'));
app.use('/test/search_address', require('./test/search_address'));
app.use('/test/search_mix', require('./test/search_mix'));
//test code end


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
var port = (process.env.PORT || '3000');
logger.app.info('app.port=' + port);
app.listen(port, function () {
	  console.log('Example app listening on port ', port);
	});

module.exports = app;
