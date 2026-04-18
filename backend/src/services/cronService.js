const cron = require("node-cron");

const Income = require("../models/Income");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const {
  formatDateKey,
  formatISTDateLong,
  getDayBoundsInIST,
  getTodayKeyInIST,
  isSameISTDay,
  IST_TIMEZONE,
} = require("../utils/date");
const { sendDailySummary, sendRecurringIncomeReminder } = require("./emailService");

let cronStarted = false;

const startCronJobs = () => {
  if (cronStarted) {
    return;
  }

  cron.schedule(
    "0 22 * * *",
    async () => {
      try {
        const ownerEmail = (process.env.OWNER_EMAIL || "").toLowerCase();
        if (!ownerEmail) {
          return;
        }

        const user = await User.findOne({ email: ownerEmail });
        if (!user) {
          return;
        }

        const { start, end } = getDayBoundsInIST(new Date());
        const transactions = await Transaction.find({
          userId: user._id,
          date: { $gte: start, $lte: end },
        }).sort({ date: 1 });

        if (!transactions.length) {
          return;
        }

        const totalIncome = transactions
          .filter((item) => item.type === "income")
          .reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = transactions
          .filter((item) => item.type === "expense")
          .reduce((sum, item) => sum + item.amount, 0);

        await sendDailySummary(user, {
          dateLabel: formatISTDateLong(new Date()),
          totalIncome,
          totalExpenses,
          transactions: transactions.map((item) => ({
            reason: item.reason,
            category: item.category,
            amount: item.amount,
            type: item.type,
            time: new Intl.DateTimeFormat("en-IN", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: IST_TIMEZONE,
            }).format(item.date),
          })),
        });
      } catch (error) {
        console.error("Daily summary cron failed:", error.message);
      }
    },
    { timezone: IST_TIMEZONE }
  );

  cron.schedule(
    "0 9 * * *",
    async () => {
      try {
        const todayKey = getTodayKeyInIST();
        const todayDayOfMonth = Number(todayKey.split("-")[2]);
        const recurringSources = await Income.find({
          isRecurring: true,
          recurringDayOfMonth: todayDayOfMonth,
        }).populate("userId");

        for (const incomeSource of recurringSources) {
          if (!incomeSource.userId) {
            continue;
          }

          if (incomeSource.lastRemindedAt && isSameISTDay(incomeSource.lastRemindedAt, new Date())) {
            continue;
          }

          await sendRecurringIncomeReminder(incomeSource.userId, incomeSource);
          incomeSource.lastRemindedAt = new Date();
          await incomeSource.save();
        }
      } catch (error) {
        console.error("Recurring income cron failed:", error.message);
      }
    },
    { timezone: IST_TIMEZONE }
  );

  cronStarted = true;
  console.log(`Cron jobs scheduled for timezone ${IST_TIMEZONE}`);
};

module.exports = {
  startCronJobs,
};
