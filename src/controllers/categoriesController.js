const pool = require("../config/database");

async function getCategories(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY id DESC");
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const categoryId = Number(req.params.id);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [categoryId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const result = await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
      [name, description || null]
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "Category name already exists" });
    }
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const categoryId = Number(req.params.id);
    const { name, description } = req.body;

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const result = await pool.query(
      "UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description || null, categoryId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "Category name already exists" });
    }
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [categoryId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: result.rows[0],
    });
  }  catch (error) {
    // 23503 هو رمز خطأ Foreign Key Constraint في PostgreSQL
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category because it contains linked products",
      });
    }
    next(error);
  
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};