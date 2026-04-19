const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { normalizeUrl } = require("./utils/url");

const app = express();
const allowedOrigin = normalizeUrl(process.env.FRONTEND_URL);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || normalizeUrl(origin) === allowedOrigin) {
        callback(null, true);
        return;
      }

      const error = new Error("Not allowed by CORS");
      error.statusCode = 403;
      callback(error);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.disable("x-powered-by");

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((_req, _res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: error.message || "Something went wrong",
  });
});

module.exports = app;
