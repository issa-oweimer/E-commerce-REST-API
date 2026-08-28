const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authenticate = require("../middleware/authenticate");
const { authorizeRoles, checkUserOrAdmin } = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { idParamValidator } = require("../validators/schemaValidators");

router.use(authenticate);

router.get("/", authorizeRoles("admin"), usersController.getUsers);
router.get("/:id", idParamValidator, validate, checkUserOrAdmin, usersController.getUserById);
router.put("/:id", idParamValidator, validate, checkUserOrAdmin, usersController.updateUser);
router.patch("/:id/toggle-status", idParamValidator, validate, authorizeRoles("admin"), usersController.toggleUserStatus);

module.exports = router;