const mongoose = require("mongoose");

const Transaction = require("../models/Transaction");
const User = require("../models/User");
const {
  formatDateKey,
  getCurrentMonthYearInIST,
  getMonthBoundsInIST,
  getPreviousWeekBoundsInIST,
  getWeekBoundsInIST,
} = require("../utils/date");

const getDashboardSummary = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const currentPeriod = getCurrentMonthYearInIST();
    const month = Number(req.query.month || currentPeriod.month);
    const year = Number(req.query.year || currentPeriod.year);
    const { start: monthStart, end: monthEnd } = getMonthBoundsInIST(month, year);
    const { start: thisWeekStart, end: thisWeekEnd } = getWeekBoundsInIST(new Date());
    const { start: lastWeekStart, end: lastWeekEnd } = getPreviousWeekBoundsInIST(new Date());
    const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);

    const [
      totals,
      monthlyTotals,
      categoryBreakdownRaw,
      frequentSpending,
      thisWeekExpenses,
      lastWeekExpenses,
      monthTransactions,
    ] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
          },
        },
      ]),
      Transaction.aggregate([
        {
          $match: {
            userId,
            date: { $gte: monthStart, $lte: monthEnd },
          },
        },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
          },
        },
      ]),
      Transaction.aggregate([
        {
          $match: {
            userId,
            type: "expense",
            date: { $gte: monthStart, $lte: monthEnd },
          },
        },
        {
          $group: {
            _id: "$category",
            amount: { $sum: "$amount" },
          },
        },
        { $sort: { amount: -1, _id: 1 } },
      ]),
      Transaction.aggregate([
        {
          $match: {
            userId,
            type: "expense",
          },
        },
        {
          $group: {
            _id: "$reason",
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
        { $sort: { count: -1, totalAmount: -1, _id: 1 } },
        { $limit: 5 },
      ]),
      Transaction.aggregate([
        {
          $match: {
            userId,
            type: "expense",
            date: { $gte: thisWeekStart, $lte: thisWeekEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
      Transaction.aggregate([
        {
          $match: {
            userId,
            type: "expense",
            date: { $gte: lastWeekStart, $lte: lastWeekEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
      Transaction.find({
        userId: req.user.id,
        date: { $gte: monthStart, $lte: monthEnd },
      }).sort({ date: 1 }),
    ]);

    const totalIncomeAllTime = totals.find((item) => item._id === "income")?.total || 0;
    const totalExpensesAllTime = totals.find((item) => item._id === "expense")?.total || 0;
    const totalIncome = monthlyTotals.find((item) => item._id === "income")?.total || 0;
    const totalExpenses = monthlyTotals.find((item) => item._id === "expense")?.total || 0;
    const thisWeek = thisWeekExpenses[0]?.total || 0;
    const lastWeek = lastWeekExpenses[0]?.total || 0;
    const percentChange = lastWeek === 0 ? (thisWeek > 0 ? 100 : 0) : ((thisWeek - lastWeek) / lastWeek) * 100;

    const categoryTotal = categoryBreakdownRaw.reduce((sum, item) => sum + item.amount, 0);
    const categoryBreakdown = categoryBreakdownRaw.map((item) => ({
      category: item._id,
      amount: item.amount,
      percentage: categoryTotal ? (item.amount / categoryTotal) * 100 : 0,
    }));

    const calendarData = monthTransactions.reduce((acc, item) => {
      const key = formatDateKey(item.date);
      if (!acc[key]) {
        acc[key] = { income: 0, expense: 0 };
      }
      acc[key][item.type] += item.amount;
      return acc;
    }, {});

    res.json({
      totalBalance: user.initialSavings + totalIncomeAllTime - totalExpensesAllTime,
      totalIncome,
      totalExpenses,
      categoryBreakdown,
      weeklyComparison: {
        thisWeek,
        lastWeek,
        percentChange,
      },
      frequentSpending: frequentSpending.map((item) => ({
        reason: item._id,
        count: item.count,
        totalAmount: item.totalAmount,
      })),
      calendarData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
};
