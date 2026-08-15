const pool = require("../config/database");

async function getUsers(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const { full_name, email } = req.body;

    if (!full_name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "full_name and email are required" });
    }

    const result = await pool.query(
      "INSERT INTO users (full_name, email) VALUES ($1, $2) RETURNING *",
      [full_name, email]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = Number(req.params.id);
    const { full_name, email } = req.body;

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!full_name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "full_name and email are required" });
    }

    const result = await pool.query(
      "UPDATE users SET full_name = $1, email = $2 WHERE id = $3 RETURNING *",
      [full_name, email, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user because they have linked records",
      });
    }
    next(error);
  }
}

async function toggleUserStatus(req, res, next) {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const userCheck = await pool.query("SELECT is_active FROM users WHERE id = $1", [
      userId,
    ]);

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const currentStatus = userCheck.rows[0].is_active;
    const newStatus = !currentStatus;

    const result = await pool.query(
      "UPDATE users SET is_active = $1 WHERE id = $2 RETURNING *",
      [newStatus, userId]
    );

    res.status(200).json({
      success: true,
      message: `User status changed to ${newStatus ? "active" : "inactive"}`,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
};