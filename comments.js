// Create web server

// Require express
const express = require("express");
const router = express.Router();

// Require mongoose
const mongoose = require("mongoose");

// Require models
const Comment = require("../models/Comment");
const User = require("../models/User");
const Post = require("../models/Post");

// Require middleware
const { ensureAuthenticated } = require("../config/auth");

// @route   GET comments/:postId
// @desc    Get all comments for a post
// @access  Private
router.get("/:postId", ensureAuthenticated, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ date: -1 })
      .populate("author", ["username"])
      .exec();
    res.send(comments);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// @route   POST comments/:postId
// @desc    Create a comment
// @access  Private
router.post("/:postId", ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).exec();
    const post = await Post.findById(req.params.postId).exec();
    const comment = new Comment({
      content: req.body.content,