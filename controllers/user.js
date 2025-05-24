const User = require('../models/user');
const asyncHandler = require('../middleware/asyncHandler');
const logAction = require('../util/logger');
const STATUS = require('../util/httpStatus');
const AppError = require('../util/AppError');

const getUser = (req, res) => {
    res.render('user')
}

const getEditProfile = (req, res) => {
    res.render('edit-profile');
}

const postEditProfile = asyncHandler( async (req, res) => {

    const { username, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', STATUS.NOT_FOUND);

    if (username) {
        logAction(req.user?.username || res.locals.user?.username, `Changed its username to: ${username}`);
        user.username = username;
    }
    if (password) {
        logAction(req.user?.username || res.locals.user?.username, `Changed its password`);
        user.password = password;
    }

    await user.save();
    res.redirect('/profile');
});

module.exports = {
    getUser,
    getEditProfile,
    postEditProfile
};