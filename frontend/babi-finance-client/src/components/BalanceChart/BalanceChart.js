import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const BalanceChart = ({ transactions = [], totalBalance = 0 }) => {
  const getCategoryData = () => {
    const categoryData = transactions.reduce((acc, transaction) => {
      // Normalize the type to handle any case-sensitivity issues
      if (transaction.type.toLowerCase() === 'expense') {
        if (!acc[transaction.category]) acc[transaction.category] = 0;
        acc[transaction.category] += parseFloat(transaction.amount) || 0; // Ensure amounts are numbers
      }
      return acc;
    }, {});

    // Return data in a format that Pie chart expects
    return {
      labels: Object.keys(categoryData),
      datasets: [
        {
          label: 'Expenses by Category',
          data: Object.values(categoryData),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'],
        },
      ],
    };
  };

  return (
    <div>
      <h3>Total Balance: {totalBalance >= 0 ? `+${totalBalance.toFixed(2)}` : `-${Math.abs(totalBalance).toFixed(2)}`}</h3>
      <h2>Expenses by Category</h2>
      {transactions.length > 0 && transactions.some((t) => t.type.toLowerCase() === 'expense') ? (
        <Pie data={getCategoryData()} />
      ) : (
        <p>No expense data to display.</p>
      )}
    </div>
  );
};

export default BalanceChart;
