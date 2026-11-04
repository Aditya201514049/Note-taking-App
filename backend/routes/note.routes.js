const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middelware");
const {
  createNote,
  getUserNotes,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/note.controller");

// All note routes require authentication
router.use(protect);

router.post("/", createNote);
router.get("/my-notes", getUserNotes);
router.get("/all", authorize("admin"), getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;