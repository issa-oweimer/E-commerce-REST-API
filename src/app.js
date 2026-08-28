const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const { globalLimiter } = require("./middleware/rateLimiter");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/productsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const usersRoutes = require("./routes/usersRoutes");

const app = express();

// Security Headers (Helmet)
app.use(helmet());

// CORS Configuration
const allowedOrigins = [process.env.CLIENT_ORIGIN || "http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS policy"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parser & General Rate Limiter
app.use(express.json({ limit: "10kb" }));
app.use(globalLimiter);

// Base Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Secured E-commerce REST API is running",
  });
});

// App Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", usersRoutes);

// Centralized 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;