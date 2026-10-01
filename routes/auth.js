const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/', (req, res) => res.redirect(req.session.userId ? '/dashboard' : '/login'));

function loginUser(req, res, user) {
  req.session.userId = user._id;
  req.session.username = user.username;
  res.redirect('/dashboard');
}

//Login
router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('login', { error: 'Wrong username or password.' });
    }
    loginUser(req, res, user);
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Something went wrong. Please try again.' });
  }
});

//Register
router.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('register', { error: null, form: {} });
});

router.post('/register', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  const confirmPassword = String(req.body.confirmPassword || '');
  const form = { name, email, username };

  const fail = message => res.render('register', { error: message, form });

  try {
    if (!name || !email || !username || !password || !confirmPassword) {
      return fail('All fields are required.');
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return fail('Please enter a valid email address.');
    }
    if (password.length < 6) {
      return fail('Password must be at least 6 characters.');
    }
    if (password !== confirmPassword) {
      return fail('Passwords do not match.');
    }
    if (await User.findOne({ username })) {
      return fail('That username is already taken.');
    }
    if (await User.findOne({ email })) {
      return fail('That email is already registered.');
    }

    const user = await User.create({ name, email, username, password: await bcrypt.hash(password, 10) });
    loginUser(req, res, user);
  } catch (err) {
    if (err.code === 11000) return fail('That username or email is already registered.');
    console.error(err);
    fail('Something went wrong. Please try again.');
  }
});

//Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

module.exports = router;
