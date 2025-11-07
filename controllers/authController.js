const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email exists' });

    const user = await User.create({ name, email, password, role: role || 'customer' });

    if (role === 'vendor') {
      const vendor = await Vendor.create({ name, owner: user._id, isActive: false });
      user.vendor = vendor._id;
      await user.save();
    }

    res.status(201).json({ token: signToken(user._id), user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ token: signToken(user._id), user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) { next(err); }
};
