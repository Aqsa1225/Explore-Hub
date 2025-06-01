// Import required modules
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');

// Log the callback URL to verify .env is loading correctly
console.log('✅ Using Google OAuth Callback URL:', process.env.GOOGLE_CALLBACK_URL);

// Configure Google OAuth strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      const avatar = profile.photos?.[0]?.value || '/images/default-avatar.png';

      if (!email) {
        return done(new Error('No email found in Google profile'), null);
      }

      // Check if user already exists
      let user = await User.findOne({ email });

      if (user) {
        // Update avatar if it changed
        if (user.avatarUrl !== avatar) {
          user.avatarUrl = avatar;
          await user.save();
        }
        return done(null, user);
      }

      // Create new user
      const newUser = await User.create({
        name: profile.displayName,
        email,
        googleId: profile.id,
        avatarUrl: avatar,
        authType: 'google',
      });

      return done(null, newUser);
    } catch (err) {
      console.error('❌ Google signup error:', err);
      return done(err, null);
    }
  }
));

// Save user ID to session (called when user logs in)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Retrieve full user from DB using the ID stored in session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
