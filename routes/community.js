// Import dependencies
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/user');
const { ensureAuthenticated } = require('../middleware/auth');

// 🔁 Get all posts with user info and comments (comment.userId as string)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'name email avatarUrl')
      .sort({ createdAt: -1 });

    const formatted = posts.map(post => {
      const postObj = post.toObject();
      postObj.comments = postObj.comments.map(c => ({
        ...c,
        userId: c.userId?.toString() // Ensure comment.userId is a string
      }));
      return postObj;
    });

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to load posts' });
  }
});

// Route to create a new post (only for authenticated users)
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newPost = new Post({
      userId: user._id,
      content: req.body.content,
      createdAt: new Date()
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully' });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Route to delete a post (only allowed if the post belongs to the user)
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Route to add a comment to a post
router.post('/:id/comment', ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const text = req.body.text?.trim();
    if (!text) return res.status(400).json({ error: 'Comment cannot be empty' });

    post.comments.push({
      userId: req.user._id,
      name: req.user.name,
      text,
      createdAt: new Date()
    });

    await post.save();
    res.status(200).json({ message: 'Comment added' });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Route to delete a specific comment by index (only allowed by the comment author)
router.delete('/:postId/comment/:commentIndex', ensureAuthenticated, async (req, res) => {
  try {
    const { postId, commentIndex } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments[commentIndex];
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Route to like or unlike a post
router.post('/:id/like', ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);  // Unlike the post
    } else {
      post.likes.push(new mongoose.Types.ObjectId(userId)); // Like the post
    }

    await post.save();
    res.json({ message: alreadyLiked ? 'Unliked' : 'Liked', likes: post.likes.length });
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ error: 'Failed to like/unlike post' });
  }
});
// Export the router
module.exports = router;
