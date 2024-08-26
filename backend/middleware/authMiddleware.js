const { verifyToken } = require('../utils/JWT');
const messages = require('../utils/messages.json');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status_code: 401,
      message: messages.en.Users.error.no_Token,
    });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      status_code: 401,
      message: messages.en.Users.error.invalid_Token,
    });
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;
