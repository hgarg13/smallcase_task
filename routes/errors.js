const express = require('express');
const router = express.Router();

/**
 * Router to handle all the routes that are not allowed
 */
router.all('*', (req, res, next) => {
	res.status('401').send('Bad Request')
});

module.exports = router;