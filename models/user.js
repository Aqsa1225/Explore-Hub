// Import Mongoose to define the schema and create the model
const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: true, // Name is required
    trim: true, // Remove extra spaces
    minlength: [2, 'Name must be at least 2 characters']
  },
  // User's email address
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },
   // Password (optional for Google users)
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    default: null // For Google users
  },
  // Google ID (only for users who register via Google)
  googleId: {
    type: String,
    unique: true,
    sparse: true 
  },
  // Type of authentication method used
  authType: {
    type: String,
    enum: ['local', 'google'],
    required: true,
    default: 'local'
  },
  // Avatar image URL for user profile
  avatarUrl: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=1abc9c&color=fff&rounded=true'
  },

  // Optional short bio about the user
  bio: {
    type: String,
    trim: true,
    maxlength: [300, 'Bio must be under 300 characters'],
    default: ''
  },
  // Optional user location
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location must be under 100 characters'],
    default: ''
  }

}, { timestamps: true });

// Export the User model for use in other files
module.exports = mongoose.model('User', userSchema);
