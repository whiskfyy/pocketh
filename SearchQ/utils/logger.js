/**
 * http://usejsdoc.org/
 */
var log4js = require('log4js');
//log4jsの設定
log4js.configure('log4js_setting.json', { reloadSecs: 60 });

var applog = log4js.getLogger("app");
var syslog = log4js.getLogger("system");

module.exports = {
		applog: applog,
		app: applog,
		syslog: syslog,
		sys: syslog
};