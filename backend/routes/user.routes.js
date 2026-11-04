const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middelware");
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByInterests,
  updateOwnProfile,
} = require("../controllers/user.controller");

// All user routes require authentication
router.use(protect);

// User can update their own profile
router.put("/profile", updateOwnProfile);

// Admin only routes
router.get("/", authorize("admin"), getAllUsers);
router.post("/", authorize("admin"), createUser);
router.get("/by-interests", authorize("admin"), getUsersByInterests);
router.get("/:id", getUserById);
router.put("/:id", authorize("admin"), updateUser);
router.delete("/:id", authorize("admin"), deleteUser);

module.exports = router;