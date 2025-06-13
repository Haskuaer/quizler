const User = require('@models/User');

async function initAdmin() {
    const userCount = await User.countDocuments();
    const adminExists = await User.exists({ role: 'admin' });

    if (userCount === 0 || !adminExists) {
        const admin = new User({
            username: 'admin',
            password: 'admin',
            role: 'admin',
        });

        await admin.save();
        console.log('🛡️  Admin account created: admin / admin');
    } else {
        console.log('✅ Admin already exists. No action taken.');
    }
}

module.exports = initAdmin;