const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // 👇 No token? Continue as guest
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    // 👇 Invalid / banned user → treat as guest
    if (!user || user.banned) {
      return next();
    }

    // 👇 Valid user
    req.user = user;
    next();
  } catch (err) {
    // 👇 Any error → silently continue
    next();
  }
};

module.exports = optionalAuth;
