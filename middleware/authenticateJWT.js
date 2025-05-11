const jwt = require('jsonwebtoken');
const STATUS = require('../util/httpStatus');
const AppError = require('../util/AppError');

exports.authenticateJWT = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        const err = new AppError('Missing token', STATUS.UNAUTHORIZED);
        return next(err);
    }

    try {
        const decoded = jwt.verify( token, process.env.JWT_SECRET );
        req.user = decoded;
        res.locals.user = decoded;
        next();

    } catch (err) {
        next(err);
    }
};