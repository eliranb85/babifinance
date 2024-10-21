const mongoose = require('mongoose');

const goldPriceSchema = new mongoose.Schema({
    pricePerOunce: Number,
    pricePerGram24kUSD: Number,
    pricePerGram18kUSD: Number,
    pricePerGram14kUSD: Number,
    pricePerGram24kILS: Number,
    pricePerGram18kILS: Number,
    pricePerGram14kILS: Number,
    exchangeRateUSDToILS: Number,
    date: String,
});

module.exports = mongoose.model('GoldPrice', goldPriceSchema);
