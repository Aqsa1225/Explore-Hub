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
    default: null // For Google users
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Prevents error with multiple nulls
  },
  authType: {
    type: String,
    enum: ['local', 'google'],
    required: true,
    default: 'local'
  },
  avatarUrl: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=1abc9c&color=fff&rounded=true'
  },

  // ✅ Optional Profile Fields
  bio: {
    type: String,
    trim: true,
    maxlength: [300, 'Bio must be under 300 characters'],
    default: ''
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location must be under 100 characters'],
    default: ''
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
