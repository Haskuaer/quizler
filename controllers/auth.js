require('dotenv').config();

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../util/token');
const asyncHandler = require('../middleware/asyncHandler');
const STATUS = require('../util/httpStatus');
const AppError = require('../util/AppError');

const getHome = (req, res) => {
    res.render('index');
};

const getLogin = (req, res) => {
    res.render('login');
};

const getRegister = (req, res) => {
    res.render('register');
};

const getForgotPassword = (req, res) => {
    res.render('passwordReset/forgot-password');
};

const getResetPassword = (req, res) => {

    const token = req.params.token;

    res.render('passwordReset/reset-password', { token: token });
};

const login = asyncHandler(async (req, res) => {

    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
        req.flash('error', 'Invalid login or password');
        return res.redirect('/login');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie( 
        'token', accessToken, 
        { 
            httpOnly: true, 
            sameSite: 'lax',
            secure: false,
            maxAge: 15*60*1000 
        });

    res.cookie(
        'refreshToken', refreshToken, 
        { 
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        });

    res.redirect('/');
});

const register = asyncHandler (async (req, res) => {
    
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
        req.flash('error', 'User already exists');
        return res.redirect('/register');
    }
    
    const user = new User({ username, password });
    await user.save();

    res.render('index', { user });
}); 

const refreshToken = asyncHandler(async (req, res) => {

    console.log("Token: " + req.cookie.token);
    console.log("Refresh Token: " + req.cookie.refreshToken);

    const token = req.cookies.refreshToken;
    if (!token) throw new AppError('No refresh token', STATUS.UNAUTHORIZED);

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user) throw new AppError('User not found', STATUS.NOT_FOUND);

    const accessToken = generateAccessToken(user);
    res.cookie(
        'token', accessToken, 
        { 
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 15*60*1000 
        });
    res.sendStatus(204);
});

const logout = (req, res) => {

    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.redirect('/');
}

const forgotPassword = asyncHandler( async (req, res, next) => {

    const user = await User.findOne({ username: req.body.username });
    if (!user) throw new AppError('User not found', STATUS.NOT_FOUND);

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 15 * 60 * 1000;
    await user.save();

    res.render('passwordReset/forgot-link', { link: `/reset-password/${token}`});
})

const resetPassword = asyncHandler( async ( req, res, next) => {

    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({
        resetToken: req.params.token,
        resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) throw new AppError('Token expired', STATUS.FORBIDEN);

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.redirect('/login');
})

module.exports = {
    getHome,
    getLogin,
    getRegister,
    getForgotPassword,
    login,
    register,
    refreshToken,
    logout,
    forgotPassword,
    getResetPassword,
    resetPassword
};