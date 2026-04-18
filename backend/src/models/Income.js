const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sourceName: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringDayOfMonth: {
    type: Number,
    min: 1,
    max: 28,
    default: null,
  },
  lastRemindedAt: {
    type: Date,
    default: null,
  },
  recordedAt: {
    type: Date,
    default: Date.now,
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

incomeSchema.index({ userId: 1, isRecurring: 1 });

module.exports = mongoose.model("Income", incomeSchema);
