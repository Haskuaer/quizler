const users = require('../models/user');

const getHome = (req, res) => {
    res.render('index', { user: null });
};

const getLogin = (req, res) => {
    res.render('login');
};

const getRegister = (req, res) => {
    res.render('register');
};

const login = (req, res) => {

    const { username, password } = req.body;
    
    const user = users.find( u => u.username === username && u.password === password);

    if(user){
        console.log('Logged in');
        res.render('index', { user: user });
    } 
    else {
        console.log('Invalid username or password');
        res.render('error');
    }
};

const register = (req, res) => {
    res.render('index', { user: user });
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