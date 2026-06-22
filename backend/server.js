const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from the parent directory (root directory)
app.use(express.static(path.join(__dirname, '..')));

// MongoDB Connection Setup
const mongodbUri = process.env.MONGODB_URI;
if (mongodbUri) {
  mongoose.connect(mongodbUri)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));
} else {
  console.log('⚠️ MONGODB_URI is not set in environment variables. Running in local fallback mode.');
}

// Schemas & Models
const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true }, // men, women, kids
  subCategory: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  sizes: [{ type: Number }],
  colors: [{
    name: { type: String },
    hex: { type: String }
  }],
  occasions: [{ type: String }],
  image: { type: String },
  description: { type: String },
  trending: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false }
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  items: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    qty: { type: Number, required: true },
    size: { type: Number },
    color: { type: String },
    image: { type: String }
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, default: 'Processing' } // Processing, Shipped, Delivered, Cancelled
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// Admin Authentication check helper
const isAdmin = (req, res, next) => {
  const adminSecret = req.headers['admin-secret'];
  if (adminSecret && adminSecret === process.env.ADMIN_PASSWORD) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Unauthorized access.' });
};

// ==========================================
// API ROUTES
// ==========================================

// 1. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const envUser = process.env.ADMIN_USERNAME || 'admin';
  const envPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === envUser && password === envPass) {
    res.json({ success: true, token: envPass, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// 2. Fetch Products
app.get('/api/products', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database disconnected. Falling back to local data.' });
    }
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Create Product (Admin Only)
app.post('/api/products', isAdmin, async (req, res) => {
  try {
    const data = req.body;
    
    if (!data.id) {
      const cleanBrand = data.brand.toLowerCase().substring(0, 3);
      const cleanCat = data.category.toLowerCase().substring(0, 1);
      const randNum = Math.floor(100 + Math.random() * 900);
      data.id = `${cleanCat}-${cleanBrand}-${randNum}`;
    }

    const newProduct = new Product(data);
    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 4. Update Product (Admin Only)
app.put('/api/products/:id', isAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 5. Delete Product (Admin Only)
app.delete('/api/products/:id', isAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Fetch Orders (Admin Only)
app.get('/api/orders', isAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database disconnected.' });
    }
    const orders = await Order.find({}).sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. Place Order (Public Checkout)
app.post('/api/orders', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database disconnected. Cannot save order.' });
    }
    const orderData = req.body;
    
    if (!orderData.id) {
      orderData.id = "FWH-" + Math.floor(10000 + Math.random() * 90000);
    }
    if (!orderData.date) {
      orderData.date = new Date().toISOString().split('T')[0];
    }

    const newOrder = new Order(orderData);
    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 8. Update Order Status (Admin Only)
app.put('/api/orders/:id/status', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 9. Database Seeder
app.post('/api/seed', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database disconnected.' });
    }
    
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      return res.json({ success: true, message: `Database already seeded with ${productCount} products.` });
    }

    // Read products_v2.js from parent directory
    const productsFileContent = fs.readFileSync(path.join(__dirname, '..', 'products_v2.js'), 'utf8');
    
    const sandbox = {};
    const evalScript = `
      ${productsFileContent}
      exports.products = generateProducts();
    `;
    const evalFunc = new Function('exports', evalScript);
    evalFunc(sandbox);
    
    const seedProducts = sandbox.products;
    
    if (seedProducts && seedProducts.length > 0) {
      await Product.deleteMany({});
      await Product.insertMany(seedProducts);
      return res.json({ success: true, message: `Successfully seeded ${seedProducts.length} products to database.` });
    } else {
      return res.status(400).json({ success: false, message: 'Could not extract products list to seed.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fallback for single-page routing - serve index.html from parent directory
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
