const mongoose = require("mongoose");

const pendingExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  note: {
    type: String,
    default: "",
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

pendingExpenseSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("PendingExpense", pendingExpenseSchema);
