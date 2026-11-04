const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const {
  createPost,
  getAllPosts,
  getPostsByUser,
} = require("../controllers/post.controller");

router.post("/", protect, createPost);
router.get("/", getAllPosts);
router.get("/user/:userId", getPostsByUser);

module.exports = router;