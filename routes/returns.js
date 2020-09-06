const express = require('express');
const router = express.Router();
const middleware = require("../middleware");
const HoldingManager = require("../helpers/holdingManager");

/**
 * GET - Router to fetch returns
 */
router.get('/', async (req, res, next) => {
	let holdingObj = new HoldingManager();
	let result = await holdingObj.fetchReturns();
	return middleware.sendResponse(req, res, result);
});


module.exports = router;