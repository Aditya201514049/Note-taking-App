const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
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
postSchema.index({ userId: 1 }); // For $lookup aggregation to get posts by user
postSchema.index({ _id: 1 }); // For fetching specific post by ID

module.exports = mongoose.model("Post", postSchema);