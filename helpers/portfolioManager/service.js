/**
 * @description: This class handles all the db queries related to portofolio manager
 */
const TradeModel = require('../../models/trade');

module.exports = class PortfolioService {
	/**
	 * @description: This method fetch all the trades from the db
	 */
	async fetchTrades() {
		try {
			return await TradeModel.find();
		} catch (err) {
			throw err;
		}
	}
};