const express = require("express");
const { body } = require("express-validator");

const authMiddleware = require("../middleware/authMiddleware");
const {
  getPublicConfig,
  requestMagicLink,
  setupUser,
  verifyMagicLink,
} = require("../controllers/authController");

const router = express.Router();

router.get("/config", getPublicConfig);
router.post(
  "/request-magic-link",
  [body("email").isEmail().withMessage("Please enter a valid email address")],
  requestMagicLink
);
router.get("/verify", verifyMagicLink);
router.post(
  "/setup",
  authMiddleware,
  [
    body("initialSavings")
      .notEmpty()
      .withMessage("Initial savings is required")
      .isFloat({ min: 0 })
      .withMessage("Initial savings must be a positive number"),
  ],
  setupUser
);

module.exports = router;
