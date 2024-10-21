import React, { useState } from 'react';
import axios from 'axios';

const TransactionForm = ({ categories, fetchTransactions }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [months, setMonths] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) return alert('Please enter an amount and select a category.');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return alert('Please enter a valid amount greater than 0.');
    }

    // Make the amount negative if it's an outcome
    let transactionAmount = type === 'outcome' ? -Math.abs(parsedAmount) : parsedAmount;

    const newTransaction = { 
      amount: transactionAmount, 
      type, 
      category, 
      paymentMethod, 
      months: paymentMethod === 'credit' ? months : null, 
      date 
    };

    try {
      // Use axios to send data to the backend
      await axios.post('http://localhost:5000/api/transactions', newTransaction);
      fetchTransactions(); // Reload transactions after submission
      setAmount('');
      setMonths('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Failed to submit transaction. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter Amount"
        required
        min="0.01"
        step="0.01"
        style={{ padding: '8px', marginBottom: '10px' }}
      />
      <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '8px', marginBottom: '10px' }}>
        <option value="income">Income</option>
        <option value="outcome">Outcome</option> {/* Outcomes will be negative */}
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px', marginBottom: '10px' }}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ padding: '8px', marginBottom: '10px' }}>
        <option value="cash">Cash</option>
        <option value="credit">Credit Card</option>
      </select>
      {paymentMethod === 'credit' && (
        <input
          type="number"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          placeholder="Number of Payments"
          required
          min="1"
          step="1"
          style={{ padding: '8px', marginBottom: '10px' }}
        />
      )}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        style={{ padding: '8px', marginBottom: '10px' }}
      />
      <button type="submit" style={{ padding: '10px', backgroundColor: '#36A2EB', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
