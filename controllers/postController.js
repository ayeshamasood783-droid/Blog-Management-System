const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Post = require("../models/Post");

function cleanSearch(value) {
  return String(value || "").trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 80);
}

exports.getPosts = async (req, res) => {
  try {
    const search = cleanSearch(req.query.search);
    const filter = search
      ? { $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } }
        ] }
      : {};

    const posts = await Post.find(filter)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json(posts);
  } catch {
    res.status(500).json({ message: "Unable to load posts." });
  }
};

exports.getPost = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid post ID." });
  }

  try {
    const post = await Post.findById(req.params.id).populate("author", "name").lean();
    if (!post) return res.status(404).json({ message: "Post not found." });
    res.json(post);
  } catch {
    res.status(500).json({ message: "Unable to load post." });
  }
};

exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id
    });

    const populated = await post.populate("author", "name");
    res.status(201).json(populated);
  } catch {
    res.status(500).json({ message: "Unable to create post." });
  }
};

exports.updatePost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid post ID." });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own posts." });
    }

    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();

    const populated = await post.populate("author", "name");
    res.json(populated);
  } catch {
    res.status(500).json({ message: "Unable to update post." });
  }
};

exports.deletePost = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid post ID." });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own posts." });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully." });
  } catch {
    res.status(500).json({ message: "Unable to delete post." });
  }
};
