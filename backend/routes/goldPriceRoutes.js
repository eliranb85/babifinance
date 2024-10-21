const express = require('express');
const router = express.Router();
const goldPriceController = require('../controllers/goldPriceController');

// Routes for Gold Prices
router.post('/api/ortidb', goldPriceController.storeGoldPrices);
router.get('/api/ortidb', goldPriceController.getGoldPrices);

module.exports = router;
