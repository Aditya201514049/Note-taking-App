const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
noteSchema.index({ userId: 1, createdAt: -1 }); // For user listing their notes with pagination
noteSchema.index({ createdAt: -1 }); // For admin listing all notes with pagination

module.exports = mongoose.model("Note", noteSchema);