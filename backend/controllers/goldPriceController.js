// controllers/goldPriceController.js
const GoldPrice = require('../models/GoldPrice');

// Store gold prices
exports.storeGoldPrices = async (req, res) => {
    try {
        const newEntry = new GoldPrice(req.body);
        await newEntry.save();
        res.status(201).json({ message: 'Prices stored successfully' });
    } catch (error) {
        console.error('Error storing prices:', error);
        res.status(500).json({ error: 'Failed to store prices' });
    }
};

// Get all gold prices
exports.getGoldPrices = async (req, res) => {
    try {
        const prices = await GoldPrice.find();
        res.json(prices);
    } catch (error) {
        console.error('Error fetching prices:', error);
        res.status(500).json({ error: 'Failed to fetch prices' });
    }
};
