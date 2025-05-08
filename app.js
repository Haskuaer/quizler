require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('./util/mongodb');
const cookieParser = require('cookie-parser');
const setUser = require('./middleware/setUser');

//ROUTERS
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

const app = express();

// SET ENGINE
app.set('view engine', 'ejs');
// SET VIEWS PATH
app.set('views', path.join(__dirname, 'views'));
// SET STATIC PATH
app.use(express.static(path.join(__dirname, 'public')));

//HANDLE COOKIES
app.use(cookieParser());
app.use(setUser);

//ALLOW POST
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', adminRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
