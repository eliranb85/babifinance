const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Routes for Transactions
router.post('/api/transactions', transactionController.createTransaction);
router.get('/api/transactions', transactionController.getTransactions);
router.delete('/api/transactions/:id', transactionController.deleteTransaction);

module.exports = router;
