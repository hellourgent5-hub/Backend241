const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

exports.createProduct = async (req, res, next) => {
  try {
    const vendorId = req.user.role === 'vendor' ? req.user.vendor : req.body.vendor;
    if (!vendorId) return res.status(400).json({ message: 'Vendor required' });
    const product = await Product.create({ ...req.body, vendor: vendorId });
    res.status(201).json(product);
  } catch (err) { next(err); }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { vendor, q, category, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (vendor) filter.vendor = vendor;
    if (q) filter.name = new RegExp(q, 'i');
    if (category) filter.category = category;
    const products = await Product.find(filter).skip((page-1)*limit).limit(Number(limit));
    res.json(products);
  } catch (err) { next(err); }
};

exports.getProduct = async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id).populate('vendor');
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    if (req.user.role === 'vendor' && product.vendor.toString() !== req.user.vendor.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
