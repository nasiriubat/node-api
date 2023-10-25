const jwt = require('jsonwebtoken');

// Middleware to verify the access token
exports.authenticate = async(req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user based on the user ID from the token
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Store the user and token in the request object
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware to check user roles (e.g., 'admin')
exports.checkUserRole = (role) => {
    return (req, res, next) => {
        const user = req.user;

        if (user && user.role === role) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    };
};