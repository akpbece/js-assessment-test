var router = require('express').Router();

router.post('/', function(req, res, next) {

	try {
		console.log(req.body);
		console.log(req.headers);
	} catch (e) {
		return next(new Error('logging error'));
	}

	res.send('Post request processed');
});

module.exports = router;
