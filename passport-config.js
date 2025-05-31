const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const avatar = profile.photos?.[0]?.value || '/images/default-avatar.png';

    let user = await User.findOne({ email });

    if (user) {
      // ✅ Always update avatar (for accuracy)
      if (user.avatarUrl !== avatar) {
        user.avatarUrl = avatar;
        await user.save();
      }
      return done(null, user);
    }

    // ✅ Create new user
    const newUser = await User.create({
      name: profile.displayName,
      email,
      googleId: profile.id,
      avatarUrl: avatar,
      authType: 'google'
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
