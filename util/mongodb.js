require('dotenv').config();
const mongoose = require('mongoose');
const initAdmin = require('./initAdmin');

mongoose.connect(process.env.MONGO_URI)
.then( async () => {
    console.log('Connected to MongoDB')
    await initAdmin();
})
.catch(err => console.error('Failed to connect to MongoDB:', err));

module.exports = mongoose;