require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('./util/mongodb');

const authController = require('./routes/auth');

const app = express();

// SET ENGINE
app.set('view engine', 'ejs');
// SET VIEWS PATH
app.set('views', path.join(__dirname, 'views'));
// SET STATIC PATH
app.use(express.static(path.join(__dirname, 'public')));

//ALLOW POST
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.use('/', authController);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
