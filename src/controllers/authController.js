const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

async function register(req, res, next) {
  try {
    const { full_name, email, password, phone, role = "customer" } = req.body;

    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(12);
    const hash_password = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, hash_password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, phone, role, is_active, created_at`,
      [full_name, email, phone || null, hash_password, role]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT id, full_name, email, hash_password, role, is_active FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      console.warn(`[AUTH] Failed login attempt for email: ${email}`);
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: "Your account is deactivated." });
    }

    const isMatch = await bcrypt.compare(password, user.hash_password);
    if (!isMatch) {
      console.warn(`[AUTH] Failed login attempt for email: ${email}`);
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    console.info(`[AUTH] User logged in successfully: ID ${user.id}`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, phone, role, is_active, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
};