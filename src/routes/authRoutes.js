const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const { registerValidator, loginValidator } = require("../validators/schemaValidators");
const { loginLimiter } = require("../middleware/rateLimiter");

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginLimiter, loginValidator, validate, authController.login);
router.get("/me", authenticate, authController.getMe);

module.exports = router;