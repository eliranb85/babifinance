const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Check if the authorization header exists and is in the correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided or improperly formatted.' });
    }

    // Proceed without token validation as you are removing JWT
    next();
};

module.exports = authenticate;
