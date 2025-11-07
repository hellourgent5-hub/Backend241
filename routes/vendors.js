const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const { protect, authorizeRoles } = require('../middleware/auth');

router.get('/', async (req,res,next) => {
  try { const vendors = await Vendor.find(); res.json(vendors); } catch (e){ next(e); }
});

router.get('/:id', async (req,res,next) => {
  try { const vendor = await Vendor.findById(req.params.id); res.json(vendor); } catch(e){ next(e); }
});

router.put('/:id', protect, authorizeRoles('admin','vendor'), async (req,res,next) => {
  try {
    const v = await Vendor.findById(req.params.id);
    if (!v) return res.status(404).json({ message:'Not found' });
    if (req.user.role === 'vendor' && v.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message:'Forbidden' });
    Object.assign(v, req.body);
    await v.save();
    res.json(v);
  } catch(e){ next(e); }
});

module.exports = router;
