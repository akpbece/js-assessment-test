'use strict';

var router = require('express').Router();

router.post('/', function(req, res, next) {

	try {
		console.log('logging');
		console.log(req.body);
		console.log(req.headers);

	} catch (e) {
		return next(new Error('logging error'));
	}

	res.send('processed');
});

module.exports = router;
