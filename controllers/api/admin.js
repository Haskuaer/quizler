const User = require("@models/User");
const asyncHandler = require('@middleware/asyncHandler');
const logAction = require('@util/logger');
const AppError = require('@util/AppError');
const STATUS = require('@util/httpStatus');

const getUsers = asyncHandler( async (req, res, next) => {

    const users = await User.find({}, 'username role active');
    res.status( STATUS.OK ).json({ users });
});

const deleteUser = asyncHandler( async (req, res) => {

    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) throw new AppError('User not found', STATUS.NOT_FOUND);

    if (userToDelete.role === 'admin') throw new AppError('You cannot delete this user', STATUS.FORBIDEN);

    await User.findByIdAndDelete(req.params.id);

    logAction(req.user?.username || res.locals.user?.username, `Deleted user: ${userToDelete.username}`);

    res.status( STATUS.CREATED ).json({ userToDelete });
});

const toggleActive = asyncHandler( async (req, res) => {

    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('User not found', STATUS.NOT_FOUND);

    if (user.role === 'admin') throw new AppError('You cannot change this user', STATUS.FORBIDEN);

    user.active = !user.active;
    await user.save();

    logAction(req.user?.username || res.locals.user?.username, `Changed ${user.username} account status to: ${user.active}`);

    res.status( STATUS.OK ).json({ user });
});

const updateUser = asyncHandler( async (req, res) => {

    const { username, role, password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('User not fount', STATUS.NOT_FOUND);

    if (user.role === 'admin') throw new AppError('You cannot change this user', STATUS.FORBIDEN);

    if (username) {
        logAction(req.user?.username || res.locals.user?.username, `Changed ${user.username} username to: ${username}`);
        user.username = username;
    }
    if (role) {
        logAction(req.user?.username || res.locals.user?.username, `Changed ${user.role} role to: ${role}`);
        user.role = role;
    }
    if (password) {
        logAction(req.user?.username || res.locals.user?.username, `Changed ${user.password}`);
        user.password = password;
    }

    await user.save();

    res.status( STATUS.OK ).json({ user });
});

module.exports = {
    getUsers,
    deleteUser,
    toggleActive,
    updateUser
};