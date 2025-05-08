const User = require('../models/User');

const getUser = (req, res) => {
    res.render('user')
}

const getEditProfile = (req, res) => {
    res.render('edit-profile');
}

const postEditProfile = async (req, res) => {

    const { username, password } = req.body;
    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (password) user.password = password;

    await user.save();
    res.redirect('/profile');
};

module.exports = {
    getUser,
    getEditProfile,
    postEditProfile
};