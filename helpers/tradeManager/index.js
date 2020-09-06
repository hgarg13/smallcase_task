const TradeService = require('./service');
const _ = require('lodash');

module.exports = class TradeManager {
	constructor() {
		this.service = new TradeService();
		this.response = {};
	}

	async addTrade(tradeData) {
		try {
			this._validateAddTradeData(tradeData);
			let prevHolding = await this.service.findHoldingForTicker(tradeData.security);
			if (_.isEmpty(prevHolding)) {
				await this._createNewHolding(tradeData);
			} else {
				await this._updateExistingHolding(prevHolding, tradeData);
			}
			let trade = await this.service.addTrade(tradeData);
			this.setResponse(200, undefined, 'Trade added successfully', trade);
		} catch (err) {
			this.setResponse(404, err.message, 'There was an error in adding trade');
		}
		return this.response;
	}

	_validateAddTradeData(tradeData) {
		if (!tradeData.security) {
			throw new Error('Please provide security');
		}
		if (!tradeData.action) {
			throw new Error('Please provide a valid action (buy/sell) for the trade');
		}
		if (tradeData.action == 1 && !tradeData.price) {
			throw new Error('Price Mandatory to buy security');
		}
		if (tradeData.action == 1 && tradeData.price < 0) {
			throw new Error('Price should be positive for buying a security');
		}
		if (tradeData.action == 2 && tradeData.price) {
			throw new Error('There should be no price in case of sell trade');
		}
		if (tradeData.shares < 0) {
			throw new Error('Share quantity cannot be negative');
		}
	}

	async _createNewHolding(tradeData) {
		try {
			if (tradeData.action == 1) {
				let newHoldingData = {
					tickerSymbol: tradeData.security,
					shares: tradeData.shares,
					avgBuyPrice: tradeData.price.toFixed(2)
				}
				await this.service.addHolding(newHoldingData);
			} else {
				throw new Error('There are no securities to sell');
			}
		} catch (err) {
			throw err;
		}
	}

	async _updateExistingHolding(prevHolding, tradeData) {
		try {
			let updateHoldingData = this._addTradeEffectOnHolding(tradeData.action, tradeData, prevHolding);
			await this.service.updateHolding(tradeData.security, updateHoldingData);
		} catch (err) {
			throw err;
		}
	}

	// Allowed to change only price and quantity
	async updateTrade(id, data) {
		try {
			if (!id) {
				throw new Error('No id found. Please provide a valid id');
			}
			let tradeToUpdate = await this.service.findTradeById(id);
			if (_.isEmpty(tradeToUpdate)) {
				throw new Error('No Trade found for the given id to update');
			}
			let tradeData = this._validateUpdateTradeData(tradeToUpdate, data)

			let holding = await this.service.findHoldingForTicker(tradeToUpdate.security);
			let updateHoldingData = this._getUpdatedHoldingData(tradeData, tradeToUpdate, holding);

			await this.service.updateTrade(id, tradeData);
			await this.service.updateHolding(tradeToUpdate.security, updateHoldingData);
			this.setResponse(200, undefined, 'Trade updated successfully');
		} catch (err) {
			console.log(err)
			this.setResponse(404, err.message, 'There was an error in updating trade');
		}
		return this.response;
	}

	_validateUpdateTradeData(tradeToUpdate, data) {
		let tradeData = {};
		if (data.shares < 0) {
			throw new Error('Share quantity cannot be negative');
		}
		if (tradeToUpdate.action == 1) {
			if (!data.price) {
				throw new Error('Price Mandatory to buy security');
			}
			if (data.price < 0) {
				throw new Error('Price should be positive for buying a security');
			}
			tradeData.price = data.price;
		}
		tradeData.shares = data.shares;
		return tradeData;
	}

	_getUpdatedHoldingData(tradeData, tradeToUpdate, holding) {
		try {
			let updateHoldingData = {};
			let previousShareCount = holding.shares - tradeToUpdate.shares;
			updateHoldingData.shares = previousShareCount + tradeData.shares;
			if (updateHoldingData.shares < 0) {
				throw new Error('Share quantity cannot be negative');
			}
			if (tradeToUpdate.action == 1) {
				let prevMean = ((holding.avgBuyPrice * holding.shares) - (tradeToUpdate.price * tradeToUpdate.shares)) / previousShareCount
				let updatedMean = (prevMean * previousShareCount + (tradeData.price * tradeData.shares)) / (previousShareCount + tradeData.shares)
				updateHoldingData.avgBuyPrice = updatedMean.toFixed(2);
			}
			return updateHoldingData;
		} catch (err) {
			throw err;
		}
	}

	_addTradeEffectOnHolding(action, trade, holding) {
		try {
			let updateHoldingData = { tickerSymbol: holding.tickerSymbol };
			if (action == 1) {
				updateHoldingData.shares = holding.shares + trade.shares
				updateHoldingData.avgBuyPrice = ((holding.shares * holding.avgBuyPrice) + (trade.shares * trade.price)) / (holding.shares + trade.shares);
				updateHoldingData.avgBuyPrice = updateHoldingData.avgBuyPrice.toFixed(2);
			} else {
				if (trade.shares && holding.shares < trade.shares) {
					throw new Error('shares to be sold cannot be greater than available shares');
				}
				updateHoldingData.shares = holding.shares - trade.shares;
			}
			if (updateHoldingData.shares < 0) {
				throw new Error('Share quantity cannot be negative');
			}
			return updateHoldingData;
		} catch (err) {
			throw err;
		}
	}

	_nullifyTradeEffectOnHolding(action, trade, holding) {
		try {
			let updateHoldingData = { tickerSymbol: holding.tickerSymbol };
			if (action == 1) {
				updateHoldingData.shares = holding.shares - trade.shares;
				updateHoldingData.avgBuyPrice = ((holding.avgBuyPrice * holding.shares) - (trade.price * trade.shares)) / updateHoldingData.shares
				updateHoldingData.avgBuyPrice = updateHoldingData.avgBuyPrice.toFixed(2);
			} else {
				updateHoldingData.shares = holding.shares + trade.shares
			}
			if (updateHoldingData.shares < 0) {
				throw new Error('Share quantity cannot be negative');
			}
			return updateHoldingData;
		} catch (err) {
			throw err;
		}
	}

	async removeTrade(id) {
		try {
			if(!id) {
				throw new Error('No id found. Please provide a valid id');
			}
			let tradeToDelete = await this.service.findTradeById(id);
			if(_.isEmpty(tradeToDelete)) {
				throw new Error('No trade found for given id');
			}
			let holding = await this.service.findHoldingForTicker(tradeToDelete.security);
			if(_.isEmpty(holding)) {
				throw new Error('No holding found for given ticker');
			}
			let updateHolding = this._nullifyTradeEffectOnHolding(tradeToDelete.action, tradeToDelete, holding);

			await this.service.updateHolding(tradeToDelete.security, updateHolding);
			await this.service.removeTrade(id);
			this.setResponse(200, undefined, 'Trade removed successfully');
		} catch (err) {
			this.setResponse(404, err.message, 'There was an error in removing trade');
		}
		return this.response;
	}

	setResponse(statusCode, error, message, data) {
		this.response = {
			statusCode,
			error,
			message,
			data
		}
	}
};