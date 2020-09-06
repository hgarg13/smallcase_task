const express = require('express');
const router = express.Router();
const middleware = require("../middleware");
const PortfolioManager = require("../helpers/portfolioManager");

/**
 * GET - Router to fetch portfolio
 */
router.get('/', async (req, res, next) => {
	let portfolioObj = new PortfolioManager();
	let result = await portfolioObj.fetchPortfolio();
	return middleware.sendResponse(req, res, result);
});

module.exports = router;