function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.status(401).render('error', { message: 'Insufficient permissions' }); 
}

module.exports = isAdmin;