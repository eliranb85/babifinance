const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'outcome'], // Ensure that both 'income' and 'outcome' are allowed
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true,
  },
  paymentMethod: {
    type: String,
    default: 'cash',
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
