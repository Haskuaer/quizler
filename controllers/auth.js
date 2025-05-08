require('dotenv').config();

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../util/token');

const getHome = (req, res) => {
    res.render('index');
};

const getLogin = (req, res) => {
    res.render('login');
};

const getRegister = (req, res) => {
    res.render('register');
};

const login = async (req, res) => {

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('login', { error: 'Invalid password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid password' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie( 'token', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });

        res.redirect('/');

    } catch (err) {
        
        console.log(err);
        res.render('error');
    }
};

const register = async (req, res) => {
    
    const { username, password } = req.body;

    try {

        const existing = await User.findOne({ username });

        if (existing) {
            return res.render('register', { error: 'User already exists' });
        }

        const user = new User({ username, password });
        await user.save();

        res.render('index', { user });

    } catch (err) {
        console.log(err);
        res.render('error');
    }
};

const refreshToken = (req, res) => {

    const token = req.cookies.refreshToken;

    if (!token) return res.status(401).redirect('/', { message: 'No refresh token' });

    try {

        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const accessToken = generateAccessToken(payload);

        res.cookie('token', accessToken, { httpOnly: true });
        res.redirect('/', { message: 'Access token refreshed' });

    } catch (err) {
        return res.status(403).redirect('/', { message: 'Invalid refresh token' });
    }
}

const logout = (req, res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.redirect('/');
}

module.exports = {
    getHome,
    getLogin,
    getRegister,
    login,
    register,
    refreshToken,
    logout
};