module.exports = {
  // Basic Authentication middleware for Admin
  basicAuth: (req, res, next) => {
    const auth = {
      login: process.env.ADMIN_LOGIN || 'admin',   // Fetch credentials from environment variables
      password: process.env.ADMIN_PASSWORD || 'admin',
    };

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    // Validate credentials
    if (login === auth.login && password === auth.password) {
      return next(); // Access granted
    }

    // If authentication fails, return 401 with WWW-Authenticate header
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    res.status(401).send('Access denied');
  },

  // Ensure the user is authenticated via session or Passport.js
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send({ message: 'User not authenticated.' });
  }
};
