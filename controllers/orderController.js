const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;
    const total = items.reduce((s, it) => s + it.price * it.qty, 0);
    const vendor = items.length ? items[0].vendor : null;
    const order = await Order.create({ customer: req.user._id, vendor, items, shippingAddress, total });
    res.status(201).json(order);
  } catch (err) { next(err); }
};

exports.getOrdersForUser = async (req, res, next) => {
  try {
    let orders;
    if (req.user.role === 'customer') {
      orders = await Order.find({ customer: req.user._id }).populate('items.product');
    } else if (req.user.role === 'vendor') {
      orders = await Order.find({ vendor: req.user.vendor }).populate('items.product');
    } else {
      orders = await Order.find().populate('items.product');
    }
    res.json(orders);
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });
    order.status = req.body.status || order.status;
    await order.save();
    res.json(order);
  } catch (err) { next(err); }
};
