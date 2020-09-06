/**
 * @description: This class handles all the db queries related to trade manager
 */
const TradeModel = require('../../models/trade');
const HoldingModel = require('../../models/holding');

module.exports = class TradeService {
	/**
	 * @description: This method adds trade to db
	 * @param {*} data 
	 */
	async addTrade(data) {
		try {
			return await TradeModel.create(data);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @description: This method removes trade from db
	 * @param {*} id 
	 */
	async removeTrade(id) {
		try {
			await TradeModel.deleteOne({ _id: id })
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @description: This method finds trade on the basis of id from db
	 * @param {*} id 
	 */
	async findTradeById(id) {
		try {
			return await TradeModel.findOne({ _id: id })
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @description: This method updates trade data on the basis of id
	 * @param {*} id 
	 * @param {*} data 
	 */
	async updateTrade(id, data) {
		try {
			return await TradeModel.updateOne({ _id: id }, { $set: data });
		} catch (err) {
			throw err
		}
	}

	/**
	 * @description: This method find holdings on the basis of ticker symbol
	 * @param {*} security 
	 */
	async findHoldingForTicker(security) {
		try {
			return await HoldingModel.findOne({ tickerSymbol: security });
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @description: This method adds holding to db
	 * @param {*} data 
	 */
	async addHolding(data) {
		try {
			await HoldingModel.create(data);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @description: This method updates holding data on the basis of ticker symbol
	 * @param {*} security 
	 * @param {*} data 
	 */
	async updateHolding(security, data) {
		try {
			await HoldingModel.updateOne({ tickerSymbol: security }, { $set: data });
		} catch (err) {
			throw err;
		}
	}
};