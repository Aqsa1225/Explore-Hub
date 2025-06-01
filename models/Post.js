// Import Mongoose to define schemas and models
const mongoose = require('mongoose');

// Define schema for individual comments on a post
const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,   // Name of the commenter (
  text: String,  // Comment text
  createdAt: { type: Date, default: Date.now }   // Timestamp of when the comment was created
});

// Define schema for community posts
const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },   // Content/message of the post
  createdAt: { type: Date, default: Date.now },  // Timestamp of post creation
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Array of user IDs who liked the post
  comments: [commentSchema] // Array of comments 
});

// Export the Post model so it can be used in routes/controllers
module.exports = mongoose.model('Post', postSchema);
