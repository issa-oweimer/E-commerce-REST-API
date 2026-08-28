const { body, param } = require("express-validator");

const registerValidator = [
  body("full_name").trim().isLength({ min: 2, max: 150 }).withMessage("Full name must be between 2 and 150 characters"),
  body("email").trim().isEmail().normalizeEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("phone").optional().trim().isLength({ max: 20 }).withMessage("Invalid phone number"),
  body("role").optional().isIn(["customer", "admin"]).withMessage("Role must be either customer or admin"),
];

const loginValidator = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

const productValidator = [
  body("category_id").isInt({ min: 1 }).withMessage("Category ID must be a positive integer"),
  body("name").trim().isLength({ min: 2, max: 200 }).withMessage("Product name must be between 2 and 200 characters"),
  body("description").optional().trim().isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than zero"),
  body("stock_quantity").optional().isInt({ min: 0 }).withMessage("Stock quantity cannot be negative"),
  body("sku").trim().notEmpty().isLength({ max: 50 }).withMessage("Valid SKU is required"),
];

const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
];

module.exports = {
  registerValidator,
  loginValidator,
  productValidator,
  idParamValidator,
};