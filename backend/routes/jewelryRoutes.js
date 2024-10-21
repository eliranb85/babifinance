const express = require('express');
const router = express.Router();
const jewelryController = require('../controllers/jewelryController');
const authenticate = require('../middleware/authMiddleware'); // Authentication middleware
const { body, validationResult } = require('express-validator');

// Middleware for validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Routes for Jewelry

// Get all jewelry entries
router.get('/api/jewelryData', jewelryController.getJewelry);

// Create a new jewelry entry (Protected Route)
router.post(
    '/api/jewelryData',
    authenticate, // Ensure the user is authenticated
    [
        body('jewelryName').notEmpty().withMessage('Jewelry name is required.'),
        body('selectedGoldType').notEmpty().withMessage('Gold type is required.'),
        body('selectedCurrency').notEmpty().withMessage('Currency is required.'),
        body('totalPrice').notEmpty().withMessage('Total price is required.'),
        body('priceForCustomer').notEmpty().withMessage('Price for customer is required.'),
        body('date').notEmpty().withMessage('Date is required.')
    ],
    validate,
    jewelryController.createJewelry
);

// Delete a single jewelry entry
router.delete('/api/jewelryData/:id', authenticate, jewelryController.deleteJewelry);

// Delete all jewelry entries
router.delete('/api/jewelryData', authenticate, jewelryController.deleteAllJewelry);

// Update the Price for Customer
router.put('/api/jewelryData/:id', authenticate, jewelryController.updateJewelryPrice);

module.exports = router;
