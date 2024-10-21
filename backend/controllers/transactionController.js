const Transaction = require('../models/Transaction');

// Create a new transaction
exports.createTransaction = async (req, res) => {
    const { amount, type, category, date } = req.body;
    console.log('Received data:', req.body); // Log the received data
    if (!amount || !type || !category || !date) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newTransaction = new Transaction({
            amount,
            type,
            category,
            date: new Date(date)
        });

        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Error storing transaction:', error);
        res.status(500).json({ error: 'Failed to store transaction' });
    }
};


// Get all transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

// Delete a transaction by ID
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
};
