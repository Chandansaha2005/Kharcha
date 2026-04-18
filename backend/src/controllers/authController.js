const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/User");
const { sendMagicLink } = require("../services/emailService");

const buildTokenHash = (token) => crypto.createHash("sha256").update(token).digest("hex");

const buildJwt = (user) =>
  jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
  );

const sanitizeUser = (user) => ({
  _id: user._id,
  email: user.email,
  initialSavings: user.initialSavings,
  setupComplete: user.setupComplete,
  createdAt: user.createdAt,
});

const buildMagicLinkEmailError = (mailError) => {
  const smtpMessage = String(mailError?.message || "");

  if (mailError?.responseCode === 535 || /Invalid login|BadCredentials/i.test(smtpMessage)) {
    const error = new Error(
      "Gmail SMTP login failed. Set EMAIL_PASS in backend/.env to a valid Gmail App Password."
    );
    error.statusCode = 502;
    return error;
  }

  const error = new Error("Unable to send the magic link email right now");
  error.statusCode = 502;
  return error;
};

const requestMagicLink = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 400;
      throw error;
    }

    const email = String(req.body.email || "").trim().toLowerCase();
    const ownerEmail = String(process.env.OWNER_EMAIL || "").trim().toLowerCase();

    if (email !== ownerEmail) {
      const error = new Error("Only the configured owner email can access this app");
      error.statusCode = 403;
      throw error;
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = buildTokenHash(rawToken);

    user.magicLinkToken = tokenHash;
    user.magicLinkExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${rawToken}`;

    try {
      await sendMagicLink(email, magicLink);
    } catch (mailError) {
      console.error("Failed to send magic link email:", mailError.message);
      throw buildMagicLinkEmailError(mailError);
    }

    res.json({ message: "Check your email" });
  } catch (error) {
    next(error);
  }
};

const verifyMagicLink = async (req, res, next) => {
  try {
    const rawToken = String(req.query.token || "");
    if (!rawToken) {
      const error = new Error("Magic link token is required");
      error.statusCode = 400;
      throw error;
    }

    const tokenHash = buildTokenHash(rawToken);
    const user = await User.findOne({
      magicLinkToken: tokenHash,
      magicLinkExpiry: { $gt: new Date() },
    });

    if (!user) {
      const error = new Error("Link expired or invalid");
      error.statusCode = 401;
      throw error;
    }

    user.magicLinkToken = null;
    user.magicLinkExpiry = null;
    await user.save();

    const token = buildJwt(user);

    res.json({
      token,
      setupComplete: user.setupComplete,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const setupUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        initialSavings: Number(req.body.initialSavings),
        setupComplete: true,
      },
      { new: true, runValidators: true }
    );

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

const getPublicConfig = async (_req, res) => {
  res.json({
    ownerEmail: process.env.OWNER_EMAIL || "",
    appName: process.env.APP_NAME || "ExpenseTracker",
  });
};

module.exports = {
  getPublicConfig,
  requestMagicLink,
  setupUser,
  verifyMagicLink,
};
