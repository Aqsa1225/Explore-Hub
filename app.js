require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const User = require('./models/user');
const Favorite = require('./models/favorite');
const asteroidRoutes = require('./routes/asteroid');
const { ensureAuthenticated } = require('./middleware/auth');

const app = express();
const port = 3000;

// ✅ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/explore-space')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Session Setup
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { sameSite: 'lax', secure: false }
}));

// ✅ Passport Setup
app.use(passport.initialize());
app.use(passport.session());
require('./passport-config');

// ✅ Get Authenticated User Info
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ userId: req.user._id, name: req.user.name, email: req.user.email });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// ✅ Get user profile (name, email, avatar, bio, location)
app.get('/api/profile', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.set('Cache-Control', 'no-store');

    res.json({
      email: user.email,
      fullName: user.name || '',
      avatarUrl: user.avatarUrl || '/images/default-avatar.png',
      bio: user.bio || '',
      location: user.location || ''
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// ✅ Update profile (name, bio, location)
app.put('/api/profile', ensureAuthenticated, async (req, res) => {
  const { fullName, bio, location } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: fullName,
        bio: bio || '',
        location: location || ''
      },
      { new: true }
    );

    res.json({
      message: 'Profile updated',
      fullName: updatedUser.name,
      bio: updatedUser.bio,
      location: updatedUser.location
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

// ✅ Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      authType: 'local',
      avatarUrl: '',
      bio: '',
      location: ''
    });

    await newUser.save();
    req.login(newUser, (err) => {
      if (err) return res.status(500).json({ error: 'Auto-login failed' });

      res.status(201).json({
        message: 'User registered and logged in',
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ✅ Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Login error' });
      res.json({ message: 'Login successful', userId: user._id });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ✅ Google OAuth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/home.html');
  }
);

// ✅ Logout
app.post('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

// ✅ Favorites Routes
app.post('/api/like', ensureAuthenticated, async (req, res) => {
  const { title, imgUrl, desc } = req.body;
  const userId = req.user._id;

  if (!userId || !title || !imgUrl) return res.status(400).json({ message: 'Missing required fields.' });

  try {
    const existing = await Favorite.findOne({ userId, imgUrl });
    if (existing) return res.status(400).json({ message: 'Already liked' });

    const newFavorite = new Favorite({ userId, title, imgUrl, desc });
    await newFavorite.save();
    res.status(200).json({ message: 'Added to favorites!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save favorite.', error: err.message });
  }
});

app.delete('/api/like', ensureAuthenticated, async (req, res) => {
  const { imgUrl } = req.body;
  const userId = req.user._id;

  if (!userId || !imgUrl) return res.status(400).json({ message: 'Missing required fields.' });

  try {
    const deleted = await Favorite.deleteOne({ userId, imgUrl });
    res.status(deleted.deletedCount > 0 ? 200 : 404).json({ message: deleted.deletedCount > 0 ? 'Removed from favorites!' : 'Favorite not found.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favorite.', error: err.message });
  }
});

app.get('/api/favorites', ensureAuthenticated, async (req, res) => {
  const userId = req.user._id;

  try {
    const favorites = await Favorite.find({ userId });
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch favorites.', error: err.message });
  }
});

// ✅ Asteroid routes
app.use('/api/asteroids', asteroidRoutes);

// ✅ Serve Pages
app.get('/favorites.html', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favorites.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
