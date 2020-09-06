const express = require('express');
const router = express.Router();
const middleware = require("../middleware");
const TradeManager = require("../helpers/tradeManager");

/**
 * POST - Router that handles adding a trade
 */
router.post('/', async (req, res, next) => {
	let tradeObj = new TradeManager();
	let result = await tradeObj.addTrade(req.body);
	return middleware.sendResponse(req, res, result);
});

/**
 * PUT - Router that handles updating a trade
 */
router.put('/:id', async (req, res, next) => {
	let tradeObj = new TradeManager();
	let result = await tradeObj.updateTrade(req.params.id, req.body);
	return middleware.sendResponse(req, res, result);
});

/**
 * DELETE - Router that handles deleting a trade
 */
router.delete('/:id', async (req, res, next) => {
	let tradeObj = new TradeManager();
	let result = await tradeObj.removeTrade(req.params.id);
	return middleware.sendResponse(req, res, result);
});

module.exports = router;