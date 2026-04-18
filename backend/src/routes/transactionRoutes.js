const express = require("express");
const { body, query } = require("express-validator");

const authMiddleware = require("../middleware/authMiddleware");
const {
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
} = require("../controllers/transactionController");

const router = express.Router();

router.use(authMiddleware);

router.get("/suggestions", getSuggestions);
router.get("/pending", getPendingExpenses);
router.get(
  "/calendar",
  [
    query("month").isInt({ min: 1, max: 12 }).withMessage("Month must be between 1 and 12"),
    query("year").isInt({ min: 2000, max: 3000 }).withMessage("Year must be valid"),
  ],
  getCalendarTotals
);
router.get("/day/:date", getTransactionsForDay);
router.get("/", getTransactions);
router.post(
  "/",
  [
    body("type").isIn(["expense", "income"]).withMessage("Transaction type is invalid"),
    body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be greater than zero"),
    body("reason").trim().notEmpty().withMessage("Reason is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
  ],
  addTransaction
);
router.post(
  "/quick",
  [body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be greater than zero")],
  addQuickExpense
);
router.patch(
  "/pending/:id/convert",
  [
    body("reason").trim().notEmpty().withMessage("Reason is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
  ],
  convertPendingExpense
);
router.delete("/pending/:id", deletePendingExpense);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
