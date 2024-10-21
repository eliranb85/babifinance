import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext'; // Adjust the path based on your folder structure
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const handleLogout = () => {
        // Implement logout functionality here
        navigate('/');
    };

    return (
        <header className="header">
            <nav>
                <ul>
                    <li>
                        <span id="welcomemsg">Welcome, {user ? user.firstname : 'Guest'}</span>
                    </li>
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                    <li>
                        <Link to="/JewelryTable">טבלת תכשיטים</Link>
                    </li>
                    <li>
                        <Link to="/BlogPostForm">Wordpress Man</Link>
                    </li>
                    <li>
                        <Link to="/BlogPostList">מאמרים</Link>
                    </li>
                    <li>
                        <Link to="GoldPrice">מחיר זהב</Link>
                    </li>
                    <li>
                        <Link to="JewelryCalculator">מחשבון תכשיט</Link>
                    </li>
                    <li>
                        <Link to="/RealTimeUserCount">Real Time User Count</Link>
                    </li>
                    <li><Link to="/HomeExpenses">Home Expenses</Link></li>
                    <li>
                        <button id="logoutbtn" onClick={handleLogout} className="logoutbtn">Log Out</button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
