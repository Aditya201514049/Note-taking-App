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
postSchema.index({ userId: 1, createdAt: -1 }); // For paginated user-post lookup
postSchema.index({ createdAt: -1 }); // For listing all posts with pagination

module.exports = mongoose.model("Post", postSchema);