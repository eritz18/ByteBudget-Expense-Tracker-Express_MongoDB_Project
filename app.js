require('dotenv').config();
const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false })); // read form data
app.use(express.static('public'));                // serve css and js
app.use(session({                                 // create sessions
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }      // sameSite helps block cross-site form posts
}));

app.use(require('./routes/auth'));
app.use('/profile', require('./routes/profile'));   // protected by requireLogin inside the file
app.use(require('./routes/expenses'));

//Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong. Please try again.');
});

process.on('unhandledRejection', err => console.error(err));

connectDB()
  .then(() => app.listen(process.env.PORT, () => console.log(`Running at http://localhost:${process.env.PORT}`)))
  .catch(err => console.error('Database connection failed:', err.message));
