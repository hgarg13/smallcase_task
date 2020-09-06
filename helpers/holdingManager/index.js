/**
 * @description: This class handles logic for holdings
 */
const HoldingService = require('./service');
const _ = require('lodash');

module.exports = class HoldingManager {
	constructor() {
		this.service = new HoldingService();
		this.response = {};
	}

	/**
	 * @description: This method fetch holdings from database and return them
	 */
	async fetchHoldings() {
		try {
			let holdings = await this.service.fetchHoldings();
			if (_.isEmpty(holdings)) {
				this.setResponse(200, undefined, 'No holdings found', holdings);
			} else {
				this.setResponse(200, undefined, 'Holdings fetched successfully', holdings);
			}
		} catch (err) {
			this.setResponse(404, err.message, 'There was an error in fetching holdings');
		}
		return this.response;
	}

	/**
	 * @description: This method fetch holdings from database and calculates cummulative return value
	 */

	async fetchReturns() {
		try {
			let holdings = await this.service.fetchHoldings();
			if (_.isEmpty(holdings)) {
				this.setResponse(200, undefined, 'No holdings exist to calculate return value');
			} else {
				let returnValue = 0;
				for (let holding of holdings) {
					let currentBuyPrice = 100;
					returnValue += (currentBuyPrice - holding.avgBuyPrice) * holding.shares;
				}
				returnValue = returnValue.toFixed(2);
				this.setResponse(200, undefined, 'Returns fetched successfully', returnValue);
			}
		} catch (err) {
			this.setResponse(404, err.message, 'There was an error in fetching returns');
		}
		return this.response;
	}

	/**
	 * @description: This method returns a generalised response object
	 * @param {*} statusCode 
	 * @param {*} error 
	 * @param {*} message 
	 * @param {*} data 
	 */
	setResponse(statusCode, error, message, data) {
		this.response = {
			statusCode,
			error,
			message,
			data
		}
	}
};