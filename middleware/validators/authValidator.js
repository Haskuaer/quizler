const { body } = require('express-validator');

exports.registerValidator = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 5 }).withMessage('Minimum 5 characters'),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Minimum 6 characters'),
];

exports.loginValidator = [
    body('username').notEmpty().withMessage('Set username'),
    body('password').notEmpty().withMessage('Set password'),
];