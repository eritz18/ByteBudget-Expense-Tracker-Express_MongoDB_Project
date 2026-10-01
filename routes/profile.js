const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const requireLogin = require('../middleware/auth');
const router = express.Router();

router.use(requireLogin);

function getCurrentUser(req) {
  return User.findById(req.session.userId);
}

function endSession(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
}

function showProfile(res, form, messages = {}) {
  res.status(messages.profileError || messages.passwordError ? 400 : 200).render('profile', {
    form,
    profileError: messages.profileError || null,
    profileSuccess: messages.profileSuccess || null,
    passwordError: messages.passwordError || null,
    passwordSuccess: messages.passwordSuccess || null
  });
}

// GET /profile
router.get('/', async (req, res, next) => {
  try {
    const user = await getCurrentUser(req);
    if (!user) return endSession(req, res);
    showProfile(res, { name: user.name, username: user.username, email: user.email });
  } catch (err) {
    next(err);
  }
});

// POST /profile
router.post('/', async (req, res, next) => {
  const name = String(req.body.name || '').trim();
  const username = String(req.body.username || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const form = { name, username, email };
  const fail = message => showProfile(res, form, { profileError: message });

  try {
    const user = await getCurrentUser(req);
    if (!user) return endSession(req, res);

    if (!name || !username || !email) {
      return fail('Name, username and email are required.');
    }
    if (name.length > 50 || username.length > 30) {
      return fail('Name (max 50) or username (max 30) is too long.');
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return fail('Please enter a valid email address.');
    }

    if (await User.findOne({ username, _id: { $ne: user._id } })) {
      return fail('That username is already taken.');
    }
    if (await User.findOne({ email, _id: { $ne: user._id } })) {
      return fail('That email is already registered.');
    }

    user.name = name;
    user.username = username;
    user.email = email;
    await user.save();

    req.session.username = user.username;

    showProfile(res, form, { profileSuccess: 'Profile updated successfully.' });
  } catch (err) {
    if (err.code === 11000) return fail('That username or email is already registered.');
    next(err);
  }
});

// POST /profile
router.post('/change-password', async (req, res, next) => {
  const currentPassword = String(req.body.currentPassword || '');
  const newPassword = String(req.body.newPassword || '');
  const confirmNewPassword = String(req.body.confirmNewPassword || '');

  try {
    const user = await getCurrentUser(req);
    if (!user) return endSession(req, res);

    const form = { name: user.name, username: user.username, email: user.email };
    const fail = message => showProfile(res, form, { passwordError: message });

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return fail('Please fill in all password fields.');
    }
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return fail('Current password is incorrect.');
    }
    if (newPassword.length < 6) {
      return fail('New password must be at least 6 characters.');
    }
    if (newPassword !== confirmNewPassword) {
      return fail('New password and confirmation do not match.');
    }
    if (newPassword === currentPassword) {
      return fail('New password must be different from the current password.');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    showProfile(res, form, { passwordSuccess: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
