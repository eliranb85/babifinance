import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from '../TransactionForm/TransactionForm.js';
import TransactionList from '../TransactionList/TransactionList.js';
import CategoryManager from '../CategoryManager/CategoryManager.js';
import BalanceChart from '../BalanceChart/BalanceChart.js';

const HomeExpenses = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0); // State to track total balance
  const [filter, setFilter] = useState({ month: '', category: '' });

  useEffect(() => {
    fetchTransactions();
    fetchCategories(); // Fetch the categories on mount
    const fetchData = async () => {
      const response = await fetch('/api/transactions'); // or axios
      const data = await response.json();
      setTransactions(data);
    };
    fetchData();
  }, []);

  // Function to fetch transactions from the backend
  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(response.data);
      calculateBalance(response.data); // Calculate balance after fetching transactions
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Function to fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Function to calculate total balance
// Function to calculate total balance
const calculateBalance = (transactions) => {
  const balance = transactions.reduce((acc, transaction) => {
    return acc + parseFloat(transaction.amount); // Transaction amounts should already be negative for outcomes
  }, 0);
  setTotalBalance(balance);
};


  // Handle deletion of a single transaction
  const handleDeleteTransaction = async (transactionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${transactionId}`);
      fetchTransactions(); // Refresh the transactions list after deletion
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  // Handle deletion of all transactions
  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all transactions?')) {
      try {
        await axios.delete('http://localhost:5000/api/transactions');
        fetchTransactions(); // Refresh the transactions list after deletion
      } catch (error) {
        console.error('Error deleting all transactions:', error);
        alert('Failed to delete all transactions. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>Home Expense Tracker</h1>
      
      {/* Transaction Form */}
      <TransactionForm categories={categories} fetchTransactions={fetchTransactions} />

      {/* Total Balance Display */}
      <h2>Total Balance: {totalBalance >= 0 ? `+${totalBalance.toFixed(2)}` : `-${Math.abs(totalBalance).toFixed(2)}`}</h2>

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        categories={categories}
        filter={filter}
        setFilter={setFilter}
        handleDeleteTransaction={handleDeleteTransaction}
        handleDeleteAll={handleDeleteAll}
      />

     
      <CategoryManager categories={categories} setCategories={setCategories} />
      <BalanceChart transactions={transactions} totalBalance={totalBalance} />
      </div>
  );
};

export default HomeExpenses;
