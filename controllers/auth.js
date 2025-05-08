const User = require('../models/User');

const getHome = (req, res) => {
    res.render('index', { user: null });
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

        res.render('index', { user });

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

const logout = (req, res) => {
    res.render('index', { user: null });
}

module.exports = {
    getHome,
    getLogin,
    getRegister,
    login,
    register,
    logout
};