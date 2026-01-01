const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function auth(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({ error: { message: 'Authorization required', code: 'AUTH_REQUIRED' } });
  const token = authHeader.replace('Bearer ', '');
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
    req.user = await User.findById(payload.id).select('-passwordHash');
    if(!req.user) return res.status(401).json({ error: { message: 'User not found', code: 'AUTH_REQUIRED' } });
    next();
  }catch(e){
    return res.status(401).json({ error: { message: 'Invalid token', code: 'AUTH_REQUIRED' } });
  }
}

module.exports = auth;
