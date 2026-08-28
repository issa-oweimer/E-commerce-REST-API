const pool = require("../config/database");

async function getUsers(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, phone, role, is_active, created_at FROM users ORDER BY id DESC"
    );
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

    const result = await pool.query(
      "SELECT id, full_name, email, phone, role, is_active, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = Number(req.params.id);
    const { full_name, phone } = req.body;

    const result = await pool.query(
      "UPDATE users SET full_name = COALESCE($1, full_name), phone = COALESCE($2, phone) WHERE id = $3 RETURNING id, full_name, email, phone, role, is_active, created_at",
      [full_name || null, phone || null, userId]
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
    next(error);
  }
}

async function toggleUserStatus(req, res, next) {
  try {
    const userId = Number(req.params.id);

    const userCheck = await pool.query("SELECT is_active FROM users WHERE id = $1", [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newStatus = !userCheck.rows[0].is_active;

    const result = await pool.query(
      "UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, full_name, email, is_active",
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
  updateUser,
  toggleUserStatus,
};