require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

const seed = async () => {
  await connectDB(process.env.MONGO_URI);
  await User.deleteMany({});
  await Vendor.deleteMany({});
  await Product.deleteMany({});

  const admin = await User.create({ name:'Admin', email:'admin@local.com', password:'password', role:'admin' });
  const vendorUser = await User.create({ name:'Vendor One', email:'vendor@local.com', password:'password', role:'vendor' });
  const vendor = await Vendor.create({ name: 'Vendor One Shop', owner: vendorUser._id, isActive:true });
  vendorUser.vendor = vendor._id;
  await vendorUser.save();

  await Product.create({
    vendor: vendor._id,
    name: 'Green Shirt',
    price: 19.99,
    stock: 50,
    description: 'Nice comfortable shirt',
    images: []
  });

  console.log('Seeded!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
