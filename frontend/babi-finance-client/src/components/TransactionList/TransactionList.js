import React from 'react';

const TransactionList = ({ transactions, categories, filter, setFilter, handleDeleteTransaction, handleDeleteAll }) => {

  // Filter transactions based on the filter values
  const filteredTransactions = transactions.filter(transaction => {
    const matchesMonth = !filter.month || new Date(transaction.date).toLocaleString('en-US', { month: 'long' }) === filter.month;
    const matchesCategory = !filter.category || transaction.category === filter.category;
    return matchesMonth && matchesCategory;
  });

  // Render the filtered transactions
  const renderMonthlySummary = () => {
    return filteredTransactions.map((transaction) => (
      <tr key={transaction._id}> 
        <td>{transaction.type === 'income' ? `+${parseFloat(transaction.amount).toFixed(2)}` : `-${parseFloat(transaction.amount).toFixed(2)}`}</td>
        <td>{transaction.type === 'income' ? 'Income' : 'Outcome'}</td>
        <td>{categories.find(cat => cat._id === transaction.category)?.name || 'Unknown'}</td>
        <td>{transaction.paymentMethod === 'credit' ? `${transaction.amount} (monthly)` : transaction.amount}</td>
        <td>{new Date(transaction.date).toLocaleDateString()}</td>
        <td>
          <button onClick={() => handleDeleteTransaction(transaction._id)}>Delete</button>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <h2>Transaction List</h2>
      <input
        type="text"
        placeholder="Search by Month (e.g., January)"
        value={filter.month}
        onChange={(e) => setFilter({ ...filter, month: e.target.value })}
        style={{ padding: '8px', marginBottom: '10px' }}
      />
      <input
        type="text"
        placeholder="Search by Category"
        value={filter.category}
        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        style={{ padding: '8px', marginBottom: '10px' }}
      />
      {filteredTransactions.length === 0 ? (
        <p>No transactions to display.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {renderMonthlySummary()} 
          </tbody>
        </table>
      )}
      <button onClick={handleDeleteAll} style={{ padding: '8px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Delete All Transactions
      </button>
    </div>
  );
};

export default TransactionList;
