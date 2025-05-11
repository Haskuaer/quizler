const { validationResult } = require('express-validator');

module.exports = (view) => {
    return (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const firstError = errors.array()[0].msg;
            req.flash('error', firstError);
            return res.redirect(view);
        }

        next();
    };
};