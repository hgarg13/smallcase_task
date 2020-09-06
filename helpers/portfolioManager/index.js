/**
 * @description: This class handles logic for portfolio
 */
const PortfolioService = require('./service');
const _ = require('lodash');

module.exports = class PortfolioManager {
	constructor() {
		this.service = new PortfolioService();
		this.response = {};
	}

	/**
	 * @description: This method fetch trades from database and return them as portfolio
	 */
	async fetchPortfolio() {
		try {
			let trades = await this.service.fetchTrades();
			if (_.isEmpty(trades)) {
				this.setResponse(200, undefined, 'No trades found for the portfolio');
			} else {
				let portfolioObj = {};
				for (let trade of trades) {
					portfolioObj[trade.security] = portfolioObj[trade.security] || {};
					portfolioObj[trade.security]['tickerSymbol'] = trade.security;
					portfolioObj[trade.security]['trades'] = portfolioObj[trade.security]['trades'] || [];
					let tradeObj = {
						shares: trade.shares,
						action: (trade.action == 1 ? 'BUY' : 'SELL'),
						price: trade.price
					}
					portfolioObj[trade.security]['trades'].push(tradeObj)
				}
				let portfolio = Object.values(portfolioObj)
				this.setResponse(200, undefined, 'Portfolio fetched successfully', portfolio);
			}
		} catch (err) {
			this.setResponse(404, err.message, 'There was an error in fetching portfolio');
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