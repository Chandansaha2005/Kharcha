const { validationResult } = require("express-validator");

const Income = require("../models/Income");
const Transaction = require("../models/Transaction");
const { getDayBoundsInIST } = require("../utils/date");

const parseValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 400;
    throw error;
  }
};

const sanitizeIncome = (income) => ({
  _id: income._id,
  userId: income.userId,
  sourceName: income.sourceName,
  amount: income.amount,
  isRecurring: income.isRecurring,
  recurringDayOfMonth: income.recurringDayOfMonth,
  lastRemindedAt: income.lastRemindedAt,
  recordedAt: income.recordedAt,
  createdAt: income.createdAt,
});

const createIncome = async (req, res, next) => {
  try {
    parseValidation(req);

    if (req.body.isRecurring && !req.body.recurringDayOfMonth) {
      const error = new Error("Recurring day is required for recurring income");
      error.statusCode = 400;
      throw error;
    }

    // Properly handle date: if date string is provided, use getDayBoundsInIST to get the correct bounds
    let recordedDate;
    if (req.body.date) {
      const { start } = getDayBoundsInIST(new Date(req.body.date + "T00:00:00"));
      recordedDate = start;
    } else {
      recordedDate = new Date();
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      type: "income",
      amount: Number(req.body.amount),
      reason: req.body.sourceName,
      category: "Other",
      date: recordedDate,
      note: req.body.note || "",
    });

    const income = await Income.create({
      userId: req.user.id,
      sourceName: req.body.sourceName,
      amount: Number(req.body.amount),
      isRecurring: Boolean(req.body.isRecurring),
      recurringDayOfMonth: req.body.isRecurring ? Number(req.body.recurringDayOfMonth) : null,
      recordedAt: recordedDate,
      transactionId: transaction._id,
    });

    transaction.incomeSourceId = income._id;
    await transaction.save();

    res.status(201).json({ income: sanitizeIncome(income) });
  } catch (error) {
    next(error);
  }
};

const getIncomeSources = async (req, res, next) => {
  try {
    const incomeSources = await Income.find({ userId: req.user.id }).sort({ recordedAt: -1, createdAt: -1 });
    res.json({ incomeSources: incomeSources.map(sanitizeIncome) });
  } catch (error) {
    next(error);
  }
};

const updateIncome = async (req, res, next) => {
  try {
    parseValidation(req);

    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!income) {
      const error = new Error("Income source not found");
      error.statusCode = 404;
      throw error;
    }

    income.sourceName = req.body.sourceName ?? income.sourceName;
    income.amount = req.body.amount !== undefined ? Number(req.body.amount) : income.amount;
    income.isRecurring = req.body.isRecurring !== undefined ? Boolean(req.body.isRecurring) : income.isRecurring;
    income.recurringDayOfMonth = income.isRecurring
      ? Number(req.body.recurringDayOfMonth ?? income.recurringDayOfMonth ?? 1)
      : null;
    
    if (req.body.date) {
      const { start } = getDayBoundsInIST(new Date(req.body.date + "T00:00:00"));
      income.recordedAt = start;
    }
    
    await income.save();

    if (income.transactionId) {
      await Transaction.findByIdAndUpdate(income.transactionId, {
        amount: income.amount,
        reason: income.sourceName,
        date: income.recordedAt,
      });
    }

    res.json({ income: sanitizeIncome(income) });
  } catch (error) {
    next(error);
  }
};

const deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!income) {
      const error = new Error("Income source not found");
      error.statusCode = 404;
      throw error;
    }

    if (income.transactionId) {
      await Transaction.findByIdAndDelete(income.transactionId);
    }

    res.json({ message: "Income source deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIncome,
  deleteIncome,
  getIncomeSources,
  updateIncome,
};
