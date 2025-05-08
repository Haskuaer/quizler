require('dotenv').config();

const jwt = require('jsonwebtoken');

function generateAccessToken(user) {

    return jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1m' }
    );
}

function generateRefreshToken(user) {

    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
};