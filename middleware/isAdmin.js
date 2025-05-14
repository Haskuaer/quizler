const AppError = require('../util/AppError');
const STATUS = require('../util/httpStatus');

function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    throw new AppError('Insufficient permissions', STATUS.UNAUTHORIZED);
}

module.exports = isAdmin;