const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: String,
  isActive: { type: Boolean, default: false },
  address: String,
  zone: String,
  logoUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
