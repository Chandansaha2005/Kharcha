const { validationResult } = require("express-validator");

const mongoose = require("mongoose");

const Income = require("../models/Income");
const PendingExpense = require("../models/PendingExpense");
const Transaction = require("../models/Transaction");
const { formatDateKey, getDayBoundsFromKey, getMonthBoundsInIST } = require("../utils/date");

const parseValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 400;
    throw error;
  }
};

const sanitizeTransaction = (transaction) => ({
  _id: transaction._id,
  userId: transaction.userId,
  type: transaction.type,
  amount: transaction.amount,
  reason: transaction.reason,
  category: transaction.category,
  date: transaction.date,
  note: transaction.note,
  isPending: transaction.isPending,
  createdAt: transaction.createdAt,
});

const addTransaction = async (req, res, next) => {
  try {
    parseValidation(req);

    const transaction = await Transaction.create({
      userId: req.user.id,
      type: req.body.type,
      amount: Number(req.body.amount),
      reason: req.body.reason,
      category: req.body.category,
      date: req.body.date ? new Date(req.body.date) : new Date(),
      note: req.body.note || "",
    });

    res.status(201).json({ transaction: sanitizeTransaction(transaction) });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const filter = { userId: req.user.id };
    const { month, year, category, type } = req.query;

    if (month && year) {
      const { start, end } = getMonthBoundsInIST(month, year);
      filter.date = { $gte: start, $lte: end };
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (type && type !== "all") {
      filter.type = type;
    }

    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });

    res.json({
      transactions: transactions.map(sanitizeTransaction),
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionsForDay = async (req, res, next) => {
  try {
    const { start, end } = getDayBoundsFromKey(req.params.date);

    const transactions = await Transaction.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1, createdAt: -1 });

    res.json({
      date: req.params.date,
      transactions: transactions.map(sanitizeTransaction),
    });
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      const error = new Error("Transaction not found");
      error.statusCode = 404;
      throw error;
    }

    const updates = ["type", "amount", "reason", "category", "note"]
      .filter((field) => req.body[field] !== undefined)
      .reduce((acc, field) => {
        acc[field] = field === "amount" ? Number(req.body[field]) : req.body[field];
        return acc;
      }, {});

    if (req.body.date) {
      updates.date = new Date(req.body.date);
    }

    Object.assign(transaction, updates);
    await transaction.save();

    if (transaction.incomeSourceId) {
      await Income.findByIdAndUpdate(transaction.incomeSourceId, {
        sourceName: transaction.reason,
        amount: transaction.amount,
        recordedAt: transaction.date,
      });
    }

    res.json({ transaction: sanitizeTransaction(transaction) });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      const error = new Error("Transaction not found");
      error.statusCode = 404;
      throw error;
    }

    if (transaction.incomeSourceId) {
      await Income.findByIdAndDelete(transaction.incomeSourceId);
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};

const addQuickExpense = async (req, res, next) => {
  try {
    parseValidation(req);

    const pendingExpense = await PendingExpense.create({
      userId: req.user.id,
      amount: Number(req.body.amount),
      note: req.body.note || "",
    });

    res.status(201).json({ pendingExpense });
  } catch (error) {
    next(error);
  }
};

const getPendingExpenses = async (req, res, next) => {
  try {
    const pendingExpenses = await PendingExpense.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ pendingExpenses });
  } catch (error) {
    next(error);
  }
};

const convertPendingExpense = async (req, res, next) => {
  try {
    parseValidation(req);

    const pendingExpense = await PendingExpense.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!pendingExpense) {
      const error = new Error("Pending expense not found");
      error.statusCode = 404;
      throw error;
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      type: "expense",
      amount: Number(req.body.amount || pendingExpense.amount),
      reason: req.body.reason,
      category: req.body.category,
      date: req.body.date ? new Date(req.body.date) : new Date(),
      note: req.body.note !== undefined ? req.body.note : pendingExpense.note,
      isPending: false,
    });

    await pendingExpense.deleteOne();

    res.json({
      transaction: sanitizeTransaction(transaction),
      message: "Pending expense converted",
    });
  } catch (error) {
    next(error);
  }
};

const deletePendingExpense = async (req, res, next) => {
  try {
    const pendingExpense = await PendingExpense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!pendingExpense) {
      const error = new Error("Pending expense not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ message: "Pending expense deleted" });
  } catch (error) {
    next(error);
  }
};

const getSuggestions = async (req, res, next) => {
  try {
    const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);

    const suggestions = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: "expense",
        },
      },
      {
        $group: {
          _id: {
            reason: "$reason",
            category: "$category",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
          "_id.reason": 1,
        },
      },
      {
        $project: {
          _id: 0,
          reason: "$_id.reason",
          category: "$_id.category",
          count: 1,
        },
      },
    ]);

    res.json({ suggestions });
  } catch (error) {
    next(error);
  }
};

const getCalendarTotals = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const { start, end } = getMonthBoundsInIST(month, year);

    const totals = await Transaction.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    const calendarData = totals.reduce((acc, transaction) => {
      const key = formatDateKey(transaction.date);
      if (!acc[key]) {
        acc[key] = { income: 0, expense: 0 };
      }

      acc[key][transaction.type] += transaction.amount;
      return acc;
    }, {});

    res.json({ calendarData });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addQuickExpense,
  addTransaction,
  convertPendingExpense,
  deletePendingExpense,
  deleteTransaction,
  getCalendarTotals,
  getPendingExpenses,
  getSuggestions,
  getTransactions,
  getTransactionsForDay,
  updateTransaction,
};
