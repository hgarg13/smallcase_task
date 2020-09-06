/**
 * @description: This class handles all the db queries related to holding manager
 */
const HoldingModel = require('../../models/holding');

module.exports = class HoldingService {
	/**
	 * @description: This method fetch all the holdings from db
	 */
	async fetchHoldings() {
		try {
			return await HoldingModel.find({ shares: { $ne: 0 } });
		} catch (err) {
			throw err;
		}
	}
};