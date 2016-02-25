var router = require('express').Router();
var four0four = require('../utils/404')();

// list of our endpoints to the corresponding router
var apiList = {
	'/logger': './logger',
	'/forgotPassword': './forgotPassword',
	'/resetForgotPassword': './resetForgotPassword',
	'/login': './signin',
	'/generateAuthCode':'./generateAuthCode',
	'/verifyAuthCode':'./verifyAuthCode',
	'/resendAuthCode':'./resendAuthCode'
};

// load up all the files
for (var endPoint in apiList) {
	if (apiList.hasOwnProperty(endPoint)) {
		var _route = require(apiList[endPoint]);
		router.use(endPoint, _route);
	}
}

// if nothing above matches, return 404
router.use('/*', four0four.notFoundMiddleware);

module.exports = router;
