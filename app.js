const express = require('express');
const path = require('path');

const adminRouter = require('./routes/admin');

const app = express();
const PORT = 3000;

// SET ENGINE
app.set('view engine', 'ejs');
// SET VIEWS PATH
app.set('views', path.join(__dirname, 'views'));
// SET STATIC PATH
app.use(express.static(path.join(__dirname, 'public')));

//ALLOW POST
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.use('/', adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
