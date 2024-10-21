// src/components/Welcome.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  return (
    <div className="welcome-container">
      <h1>Welcome to the Application!</h1>
      <p>Select an option below to get started:</p>
      <nav>
        <ul>
          <li>
            <Link to="/JewelryTable">טבלת תכשיטים</Link>
          </li>
          <li>
            <Link to="/HomeExpenses">הוצאות הבית</Link>
          </li>
          <li>
            <Link to="/JewelryCalculator">יצירת תכשיט חדש</Link>
          </li>
          {/* Add more links as needed */}
        </ul>
      </nav>
    </div>
  );
}

export default Welcome;
