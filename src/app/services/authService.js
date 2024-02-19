const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

async function authService(req, res, next) {
  const { authorization } = req.headers;

  const token = authorization && authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }

  try {
    const jwtPayload = jwt.verify(token, process.env.SECRET);

    const user = await UserRepository.findById(jwtPayload.id);

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
}

module.exports = authService;
