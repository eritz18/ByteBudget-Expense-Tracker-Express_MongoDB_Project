const express = require('express');
const Expense = require('../models/Expense');
const requireLogin = require('../middleware/auth');
const router = express.Router();
const categories = Expense.categories;

router.use(requireLogin);

const handle = fn => (req, res, next) => fn(req, res, next).catch(next);

const icons = {
  Food: 'bi-cup-hot',
  Transportation: 'bi-bus-front',
  School: 'bi-book',
  Shopping: 'bi-bag',
  Bills: 'bi-receipt',
  Entertainment: 'bi-controller',
  Other: 'bi-three-dots'
};
router.use((req, res, next) => {
  res.locals.icons = icons;
  next();
});

function validateExpense(req, res, next) {
  const { description, amount, category, date } = req.body;
  if (!description || !date || !(Number(amount) >= 0) || amount === '' || !categories.includes(category)) {
    return res.status(400).send('Please fill in description, amount, category and date correctly.');
  }
  next();
}

//Dashboard
router.get('/dashboard', handle(async (req, res) => {
  const expenses = await Expense.find({ userId: req.session.userId }).sort({ date: -1 });
  const now = new Date();
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthTotal = expenses
    .filter(e => e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear())
    .reduce((sum, e) => sum + e.amount, 0);
  const highest = expenses.length ? Math.max(...expenses.map(e => e.amount)) : 0;
  res.render('dashboard', {
    username: req.session.username,
    total, monthTotal, highest,
    count: expenses.length,
    recent: expenses.slice(0, 5)
  });
}));

//search / category / date filters
router.get('/expenses', handle(async (req, res) => {
  const { search = '', category = '', date = '' } = req.query;
  const filter = { userId: req.session.userId };
  if (search) filter.description = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  if (category) filter.category = category;
  if (date) {
    const start = new Date(date);
    filter.date = { $gte: start, $lt: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
  }
  const expenses = await Expense.find(filter).sort({ date: -1 });
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  res.render('expenses', { expenses, total, categories, search, category, date });
}));

//Add
router.get('/expenses/new', (req, res) => {
  res.render('expense-form', { expense: null, categories });
});
router.post('/expenses', validateExpense, handle(async (req, res) => {
  const { description, amount, category, date, notes } = req.body;
  await Expense.create({ userId: req.session.userId, description, amount, category, date, notes });
  res.redirect('/expenses');
}));

//Edit
router.get('/expenses/:id/edit', handle(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, userId: req.session.userId });
  if (!expense) return res.status(404).send('Expense not found.');
  res.render('expense-form', { expense, categories });
}));
router.post('/expenses/:id', validateExpense, handle(async (req, res) => {
  const { description, amount, category, date, notes } = req.body;
  await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.session.userId },
    { description, amount, category, date, notes }
  );
  res.redirect('/expenses');
}));

//Delete
router.post('/expenses/:id/delete', handle(async (req, res) => {
  await Expense.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
  res.redirect('/expenses');
}));

module.exports = router;
