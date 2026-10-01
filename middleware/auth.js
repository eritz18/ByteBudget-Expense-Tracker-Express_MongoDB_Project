function requireLogin(req, res, next) {
  res.set('Cache-Control', 'no-store');
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

module.exports = requireLogin;
