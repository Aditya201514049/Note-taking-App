const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middelware");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByInterests,
} = require("../controllers/user.controller");

// All user routes require authentication
router.use(protect);

// Admin only routes
router.get("/", authorize("admin"), getAllUsers);
router.get("/by-interests", authorize("admin"), getUsersByInterests);
router.get("/:id", getUserById);
router.put("/:id", authorize("admin"), updateUser);
router.delete("/:id", authorize("admin"), deleteUser);

module.exports = router;