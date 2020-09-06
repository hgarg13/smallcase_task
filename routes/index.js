var express = require('express');
var router = express.Router();

/**
 * GET - Render Welcome Page 
 */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Smallcase Trade Application' });
});

module.exports = router;