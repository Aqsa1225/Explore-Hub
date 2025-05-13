const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ email: profile.emails[0].value });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
      authType: 'google' // ✅ Important: mark as Google user
    });

    return done(null, newUser);
  } catch (err) {
    console.error('❌ Google signup error:', err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
