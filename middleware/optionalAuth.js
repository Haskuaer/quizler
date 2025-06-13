const jwt = require('jsonwebtoken');
const User = require('@models/User');
const { generateAccessToken } = require('@util/token');

// Nie używa AppError – nie rzuca błędów
module.exports = async function optionalAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.locals.user = decoded;
    return next();
  } catch (err) {
    // Obsługa tokenu wygasłego – odśwież token lub kontynuuj jako gość
    if (err.name !== 'TokenExpiredError') {
      req.user = null;
      return next();
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      req.user = null;
      return next();
    }

    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(payload.id);

      if (!user) {
        req.user = null;
        return next();
      }

      const newAccessToken = generateAccessToken(user);
      res.cookie('token', newAccessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 15 * 60 * 1000
      });

      req.user = {
        id: user._id,
        username: user.username,
        role: user.role
      };

      res.locals.user = req.user;
    } catch (innerErr) {
      req.user = null;
    }

    return next();
  }
};
