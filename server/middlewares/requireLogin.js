const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const USER = mongoose.model('USER');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Access Denied: No token provided' });
  }

  const token = authorization.replace('Bearer ', '');  // Remove "Bearer " from token

  try {
    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.Jwt_secret);

    // Check if Google OAuth user (based on token payload structure, e.g., email)
    if (decoded.email) {
      // Google OAuth user (token contains email and possibly other info)
      req.user = decoded;  // Attach Google user info directly to the request
    } else {
      // Regular JWT user, find the user from the database
      const user = await USER.findById(decoded._id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      req.user = user;  // Attach MongoDB user data to the request
    }

    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
};
