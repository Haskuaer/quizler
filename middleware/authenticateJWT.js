const jwt = require('jsonwebtoken');

exports.authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.locals.user = null;
        return res.status(401).render('login', { error: 'You have to sign in' });
    }

    try {
        const decoded = jwt.verify( token, process.env.JWT_SECRET );
        req.user = decoded;
        next();

    } catch (err) {
        console.error('Authorization problem: ', err);
        res.locals.user = null;
        res.status(401).render('login', { error: 'Invalid or expired token' });
    }
};