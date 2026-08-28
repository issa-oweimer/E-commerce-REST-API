const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const authenticate = require("../middleware/authenticate");
const { authorizeRoles } = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { productValidator, idParamValidator } = require("../validators/schemaValidators");

// مسارات متاحة للجميع
router.get("/", productsController.getProducts);
router.get("/:id", idParamValidator, validate, productsController.getProductById);

// مسارات محصورة بـ Admin
router.post("/", authenticate, authorizeRoles("admin"), productValidator, validate, productsController.createProduct);
router.put("/:id", authenticate, authorizeRoles("admin"), idParamValidator, productValidator, validate, productsController.updateProduct);
router.patch("/:id/deactivate", authenticate, authorizeRoles("admin"), idParamValidator, validate, productsController.deactivateProduct);

module.exports = router;