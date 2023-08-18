const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

const jwtMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    const user = await User.findById(decoded.id);
    // console.log('User found:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Set the user info to the request object
    // console.log('User set in JWT middleware:', req.user);
    next();
  });
};

module.exports = jwtMiddleware;
