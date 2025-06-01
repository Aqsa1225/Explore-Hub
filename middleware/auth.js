module.exports = {
  // Basic Authentication middleware for Admin
  basicAuth: (req, res, next) => {
    const auth = {
      login: process.env.ADMIN_LOGIN || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin',
    };

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    // If credentials are correct, proceed to next middleware
    if (login === auth.login && password === auth.password) {
      return next(); // Access granted
    }

    // If credentials are incorrect, deny access and prompt for login
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).json({ error: 'Admin access denied. Invalid credentials.' });
  },

  // Ensure user is authenticated via session/Passport
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next(); // User is logged in, proceed
    }
    return res.status(401).json({ error: 'Login required' }); // If not logged in, block access
  }
};
