const mongoose = require("mongoose");
let moment = require('moment');

/**
 * @description: It setup the trade schema in the mongo database
 */
const tradeSchema = new mongoose.Schema({
	security: { type: mongoose.Schema.Types.String, ref: 'Holding', required: true },
	action: { type: Number, enum: [1, 2] }, // allowed values: 1 (BUY), 2 (SELL)
	shares: Number,
	price: Number,
	whenCreated: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') }
});

module.exports = mongoose.model("Trade", tradeSchema);