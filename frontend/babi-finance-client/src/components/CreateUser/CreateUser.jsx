// CreateUser.jsx
import React, { useState } from 'react';
import axios from 'axios';

function CreateUser() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Debugging: Log the data being sent
        console.log('Sending user data:', {
            name,
            username,
            email,
            role,
            password
        });

        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                name,
                username,
                password,
                email,
                role
            });
            setSuccess(response.data.message);
            // Optionally, clear the form fields
            setName('');
            setUsername('');
            setEmail('');
            setRole('');
            setPassword('');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError('There was an error creating the user!');
            }
            console.error('AxiosError:', error);
        }
    };

    return (
        <div className="CreateUser">
            <form onSubmit={handleCreateUser}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Role:
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Create User</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
        </div>
    );
}

export default CreateUser;
