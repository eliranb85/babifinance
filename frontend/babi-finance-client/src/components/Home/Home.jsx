import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext'; // Adjust the path based on your folder structure
import './Home.css';
import signInIcon from '../../assist/icons/sun_503351.svg'; // Adjust the path based on your folder structure
import userPlusIcon from '../../assist/icons/family_1416832.svg'; 
import websiteLogo from '../../assist/icons/BabiFinance/2.svg';

function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                username,
                password
            });
    
            if (response.data.message === 'Login successful') {
                setUser({ firstname: username }); // Set the user context
                navigate('/Welcome'); // Navigate to the home page or another component
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('There was an error logging in!', error);
            alert('Login failed: ' + error.response?.data?.error || 'Unknown error');
        }
    };
    

    const handleRegisterClick = () => {
        navigate('/CreateUser');
    };

    return (
        <div className="Home">
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label>שם משתמש:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>ססמא:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="button-container">
                    <button type="submit">
                        כניסה
                        <img src={signInIcon} alt="Sign In" style={{ marginRight: '8px' }} />
                    </button>
                    <button
                        type="button"
                        id="createuserbtn"
                        onClick={handleRegisterClick}
                    >
                        משתמש חדש
                        <img src={userPlusIcon} alt="Create User" style={{ marginRight: '15px' }} />
                    </button>
                </div>
            </form>
            <div className="logohome">
                <img src={websiteLogo} alt="Website Logo" style={{ marginRight: '15px' }} />
            </div>
        </div>
    );
}

export default Home;
