import { useState, useEffect } from 'react';

// Custom hook to manage JWT token
const useToken = () => {
  // Get the token from localStorage if it exists, or set an empty string
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    // If token doesn't exist, prompt the user to enter it
    if (!token) {
      const userToken = prompt('Please enter your JWT token:');
      if (userToken) {
        // Store the token in the local state and localStorage
        setToken(userToken);
        localStorage.setItem('token', userToken); // Save the token to localStorage
      }
    }
  }, [token]); // This will only run when `token` changes or is empty

  // Return the token so that it can be used in requests
  return token;
};

export default useToken;
