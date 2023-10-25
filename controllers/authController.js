require('dotenv').config();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_SECRET;

//register
exports.register = async(req, res) => {
    try {
        const { username, email, password, role } = req.body;
        console.log(req.body);
        if (username == null || email == null || password == null || role == null) {
            return res.status(400).json({ message: 'All fields required.' });
        }
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        // res.json(req.body);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
        // const hashedPassword = password;

        console.log('----------------');
        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//login
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (email == null || password == null) {
            return res.status(400).json({ message: 'All fields required.' });
        }
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Email.' });
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid Password.' });
        }

        // Generate JWT access token
        const accessToken = jwt.sign({ userId: user._id, email: user.email, role: user.role },
            JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            accessToken,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Refresh Token
exports.refreshToken = async(req, res) => {
    try {
        const refreshToken = req.body.refreshToken;

        // Verify the refresh token (assuming you have a valid refresh token)
        const user = verifyRefreshToken(refreshToken);

        // Generate a new access token
        const accessToken = jwt.sign({ userId: user._id, email: user.email, role: user.role },
            JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            accessToken,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Helper function to verify the refresh token
function verifyRefreshToken(refreshToken) {
    try {
        // Verify the refresh token using your JWT secret
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

        // Ensure the token contains the expected data
        if (!decoded.userId || !decoded.email || !decoded.role) {
            throw new Error('Invalid token data');
        }

        // Return the user data associated with the token
        return {
            _id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
    } catch (error) {
        // If verification fails or the token is invalid, return an error or null
        console.error('Token verification error:', error);
        return null;
    }
}


exports.logout = async(req, res) => {
    const token = req.headers.authorization; // Assuming you send the token in the Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify the token and get the user ID from it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the user ID
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Store the token in the user's document to mark it as invalidated
        user.invalidTokens.push(token);
        await user.save();

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};