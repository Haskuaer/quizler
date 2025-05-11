require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const mongoose = require('./util/mongodb');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const setCsfr = require('./middleware/setCsrf');
const setUser = require('./middleware/setUser');


//ROUTERS
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

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

//ROUTES
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', adminRouter);

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
