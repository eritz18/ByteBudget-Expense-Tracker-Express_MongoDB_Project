const mongoose = require('mongoose');

const categories = ['Food', 'Transportation', 'School', 'Shopping', 'Bills', 'Entertainment', 'Other'];

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, enum: categories, required: true },
  date: { type: Date, required: true },
  notes: { type: String, default: '' }
});

module.exports = mongoose.model('Expense', expenseSchema);
module.exports.categories = categories;
