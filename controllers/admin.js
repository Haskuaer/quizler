const User = require("../models/User");

const adminDashboard = (req, res) => {
    res.render('admin')
}

const getUsers = async (req, res, next) => {

    const users = await User.find({}, 'username role active');
    res.render('admin-users', { users });
};

const deleteUser = async (req, res) => {

    const userToDelete = await User.findById(req.params.id);

    if (userToDelete.role === 'admin') {
        return res.status(403).render('error', { message: 'You cannot delete this user' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.redirect('/admin/users');
};

const toggleActive = async (req, res) => {

    const user = await User.findById(req.params.id);

    if (user.role === 'admin') {
        return res.status(403).render('error', { message: 'You cannot delete this user' });
    }

    user.active = !user.active;
    await user.save();
    res.redirect('/admin/users');
};

const updateUser = async (req, res) => {

    const { username, role, password } = req.body;
    const user = await User.findById(req.params.id);

    if (user.role === 'admin') {
        return res.status(403).render('error', { message: 'You cannot delete this user' });
    }

    if (username) user.username = username;
    if (role) user.role = role;
    if (password) user.password = password;

    await user.save();
    res.redirect('/admin/users');
};

module.exports = {
    adminDashboard,
    getUsers,
    deleteUser,
    toggleActive,
    updateUser
};