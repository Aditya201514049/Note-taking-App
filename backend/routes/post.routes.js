const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const {
  createPost,
  getAllPosts,
  getPostsByUser,
} = require("../controllers/post.controller");

// All post routes require authentication
router.use(protect);

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/user/:userId", getPostsByUser);

module.exports = router;