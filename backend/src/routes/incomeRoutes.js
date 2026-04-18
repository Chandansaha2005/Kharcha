const express = require("express");
const { body } = require("express-validator");

const authMiddleware = require("../middleware/authMiddleware");
const {
  createIncome,
  deleteIncome,
  getIncomeSources,
  updateIncome,
} = require("../controllers/incomeController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getIncomeSources);
router.post(
  "/",
  [
    body("sourceName").trim().notEmpty().withMessage("Source name is required"),
    body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be greater than zero"),
    body("recurringDayOfMonth")
      .optional({ values: "falsy" })
      .isInt({ min: 1, max: 28 })
      .withMessage("Recurring day must be between 1 and 28"),
  ],
  createIncome
);
router.patch(
  "/:id",
  [
    body("sourceName").optional().trim().notEmpty().withMessage("Source name cannot be empty"),
    body("amount").optional().isFloat({ min: 0.01 }).withMessage("Amount must be greater than zero"),
    body("recurringDayOfMonth")
      .optional({ values: "falsy" })
      .isInt({ min: 1, max: 28 })
      .withMessage("Recurring day must be between 1 and 28"),
  ],
  updateIncome
);
router.delete("/:id", deleteIncome);

module.exports = router;
