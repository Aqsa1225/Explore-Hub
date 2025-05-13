const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    default: null
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true  // ✅ sparse = prevents duplicate null errors
    // 🚫 No default: null
  },
  authType: {
    type: String,
    enum: ['local', 'google'],
    required: true,
    default: 'local'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
