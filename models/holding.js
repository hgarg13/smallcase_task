const mongoose = require("mongoose");

/**
 * @description: It setup the holding schema in the mongo database
 */
const holdingSchema = new mongoose.Schema({
	tickerSymbol: { type: String, unique: true },
	avgBuyPrice: Number,
	shares: Number
});

module.exports = mongoose.model("Holding", holdingSchema);