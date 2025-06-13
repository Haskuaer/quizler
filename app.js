require('module-alias/register');
require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const mongoose = require('@util/mongodb');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const setCsfr = require('@middleware/setCsrf');
const setUser = require('@middleware/setUser');


//ROUTES
const adminRouter = require('@routes/api/admin');
const authRouter = require('@routes/api/auth');
const quizRouter = require('@routes/api/quiz');
const userRouter = require('@routes/api/user');
const viewRouter = require('@routes/views');

const app = express();

//SECURITY
app.use(helmet());

// SET ENGINE
app.set('view engine', 'ejs');
// SET VIEWS PATH
app.set('views', path.join(__dirname, 'views'));
// SET STATIC PATH
app.use(express.static(path.join(__dirname, 'public')));

//ALLOW POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//COOKIE HANDLING
app.use(cookieParser());

//SESSION FOR FLASH
app.use(session({
  secret: process.env.SESSION_SECRET || 'tajne',
  resave: false,
  saveUninitialized: false
}));

//FLASH
app.use(flash());

//LOCALS & CSRF
app.use(setUser);
app.use(csrf({ cookie: true }));

//SET CSRF TOKEN
app.use(setCsfr);

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});

//ROUTES
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/user', userRouter);
app.use('/', viewRouter);


app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page not found',
    status: 404
  });
});

//ERROR
app.use((err, req, res, next) => {

  if (err.status === 401 && err.message === 'No refresh token') {
    return res.sendStatus(204);
  }

  console.error('Error: ', err);

  res.status(err.status || 500);
  res.render('error', {
    message: err.message || 'Something went wrong!',
    status: err.status || 500
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
