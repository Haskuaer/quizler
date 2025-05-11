const jwt = require('jsonwebtoken');
const STATUS = require('../util/httpStatus');
const AppError = require('../util/AppError');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');
const { generateAccessToken } = require('../util/token');

exports.authenticateJWT = asyncHandler( async(req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        throw new AppError('Missing token', STATUS.UNAUTHORIZED);
    }

    try {
        const decoded = jwt.verify( token, process.env.JWT_SECRET );
        req.user = decoded;
        res.locals.user = decoded;
        return next();

    } catch (err) {

        if (err.name !== 'TokenExpiredError') { throw err; }

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AppError('Session expired. Please log in again', STATUS.UNAUTHORIZED);
        }

        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(payload.id);

        if (!user) {
            throw new AppError('User not found', STATUS.UNAUTHORIZED);
        }

        const newAccessToken = generateAccessToken(user);
        res.cookie('token', newAccessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 15 * 60 * 1000
        });

        req.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        res.locals.user = req.user;
        return next();

    }
});