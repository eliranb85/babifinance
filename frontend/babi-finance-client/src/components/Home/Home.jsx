import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Optional: Add loading state

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);  // Set loading state to true
        setError('');  // Clear any previous error messages

        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
            
            if (response.data && response.data.token) {
                const token = response.data.token;
                localStorage.setItem('token', token); // Store the token
                alert('Login successful');
                // Optionally redirect or do something after login
            } else {
                setError('Login failed: No token received.');
            }
        } catch (error) {
            if (error.response) {
                // Backend error (4xx, 5xx response codes)
                setError(error.response.data.message || 'Login failed: Server error.');
            } else {
                // Network error or other issues
                setError('Login failed: Please check your connection.');
            }
            console.error('Login error:', error);
        } finally {
            setLoading(false);  // Set loading state to false after request
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}> {/* Disable button while loading */}
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Home;
