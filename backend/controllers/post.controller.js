const mongoose = require("mongoose");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const getPagination = require("../utils/pagination");

// Create post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all posts (with pagination)
const getAllPosts = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const posts = await Post.find()
      .populate('userId', 'username email') // Populate user details
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// AGGREGATION TASK 2: Get posts for a specific user using $lookup
const getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const { page, limit, skip } = getPagination(req.query);

    const result = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: Post.collection.name,
          localField: "_id",
          foreignField: "userId",
          pipeline: [
            { $sort: { createdAt: -1 } },
            {
              $facet: {
                data: [{ $skip: skip }, { $limit: limit }],
                total: [{ $count: "count" }],
              },
            },
            {
              $project: {
                data: 1,
                total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
              },
            },
          ],
          as: "postResults",
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          posts: { $ifNull: [{ $arrayElemAt: ["$postResults.data", 0] }, []] },
          total: { $ifNull: [{ $arrayElemAt: ["$postResults.total", 0] }, 0] },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: result[0]._id,
        username: result[0].username,
      },
      posts: result[0].posts,
      pagination: {
        page,
        limit,
        total: result[0].total,
        pages: Math.ceil(result[0].total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostsByUser,
};