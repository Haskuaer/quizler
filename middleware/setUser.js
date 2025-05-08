const jwt = require('jsonwebtoken');

const setUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.locals.user = null;
        return next();
    }

    try { 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        res.locals.user = decoded;

    } catch (err) {
        res.locals.user = null;
    }

    next();
};

module.exports = setUser;