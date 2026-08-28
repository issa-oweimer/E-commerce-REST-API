const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");
const authenticate = require("../middleware/authenticate");
const { authorizeRoles } = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { idParamValidator } = require("../validators/schemaValidators");

router.get("/", categoriesController.getCategories);
router.get("/:id", idParamValidator, validate, categoriesController.getCategoryById);

router.post("/", authenticate,  authorizeRoles("admin"), categoriesController.createCategory);
router.put("/:id", authenticate, authorizeRoles("admin"), idParamValidator, validate, categoriesController.updateCategory);
router.delete("/:id", authenticate, authorizeRoles("admin"), idParamValidator, validate, categoriesController.deleteCategory);

module.exports = router;