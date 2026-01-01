const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');

const registerSchema = Joi.object({ name: Joi.string().allow(''), email: Joi.string().email().required(), password: Joi.string().min(6).required() });
const loginSchema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });

router.post('/register', async (req, res, next)=>{
  try{
    const { error, value } = registerSchema.validate(req.body);
    if(error) return res.status(400).json({ error: { message: error.message, code: 'INVALID' } });
    const { name, email, password } = value;
    const exists = await User.findOne({ email });
    if(exists) return res.status(400).json({ error: { message: 'Email already registered', code: 'ALREADY_EXISTS' } });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  }catch(e){ next(e); }
});

router.post('/login', async (req, res, next)=>{
  try{
    const { error, value } = loginSchema.validate(req.body);
    if(error) return res.status(400).json({ error: { message: error.message, code: 'INVALID' } });
    const { email, password } = value;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ error: { message: 'Invalid credentials', code: 'INVALID' } });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({ error: { message: 'Invalid credentials', code: 'INVALID' } });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  }catch(e){ next(e); }
});

router.get('/me', require('../middleware/auth'), async (req, res)=>{
  res.json({ user: req.user });
});

module.exports = router;
