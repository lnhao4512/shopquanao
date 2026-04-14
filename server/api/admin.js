const express = require('express');
const router = express.Router();
// utils
const JwtUtil = require('../utils/JwtUtil');
// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');
const BannerDAO = require('../models/BannerDAO');

// login
router.post('/login', async function (req, res) {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '').trim();
    if (username && password) {
      const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
      if (admin) {
        const token = JwtUtil.genToken(admin.username, admin.password);
        res.json({ success: true, message: 'Authentication successful', token: token });
      } else {
        res.json({ success: false, message: 'Incorrect username or password' });
      }
    } else {
      res.json({ success: false, message: 'Please input username and password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  try {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    res.json({ success: true, message: 'Token is valid', token: token });
  } catch (error) {
    console.error('Token check error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ===================== CATEGORY =====================

// Lấy tất cả categories (flat list)
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  try {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Lấy categories dạng cây (tree structure)
router.get('/categories/tree', JwtUtil.checkToken, async function (req, res) {
  try {
    const tree = await CategoryDAO.selectTree();
    res.json(tree);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Lấy chỉ leaf categories (không có con) – dùng cho dropdown chọn category sản phẩm
router.get('/categories/leaves', JwtUtil.checkToken, async function (req, res) {
  try {
    const leaves = await CategoryDAO.selectLeaves();
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Tạo category mới (có thể có parentId)
router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  try {
    const name = req.body.name;
    const parentId = req.body.parentId || null;
    if (!name) return res.status(400).json({ success: false, message: 'Tên danh mục không được để trống' });
    const category = { name, parentId };
    const result = await CategoryDAO.insert(category);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cập nhật category
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const name = req.body.name;
    const parentId = req.body.parentId || null;
    const category = { _id, name, parentId };
    const result = await CategoryDAO.update(category);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Xóa category (kiểm tra không có con)
router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const result = await CategoryDAO.delete(_id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ===================== PRODUCT =====================
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  var products = await ProductDAO.selectAll();
  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page);
  const offset = (curPage - 1) * sizePage;
  products = products.slice(offset, offset + sizePage);
  const result = { products: products, noPages: noPages, curPage: curPage };
  res.json(result);
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
  try {
    const name = req.body.name;
    const price = req.body.price;
    const cid = req.body.category;
    const image = req.body.image;
    const variants = req.body.variants || [];   // array [{size,stock,price}]
    const now = new Date().getTime();

    // Tính toán totalStock
    let totalStock = 0;
    variants.forEach(v => {
      totalStock += parseInt(v.stock) || 0;
    });

    // Kiểm tra category phải là leaf node
    const leaves = await CategoryDAO.selectLeaves();
    const isLeaf = leaves.some((l) => String(l._id) === String(cid));
    if (!isLeaf) {
      return res.status(400).json({ success: false, message: 'Sản phẩm chỉ được gắn vào danh mục cấp cuối (leaf)' });
    }

    const category = await CategoryDAO.selectByID(cid);
    const product = { name, price, image, cdate: now, category, variants, totalStock, updatedAt: new Date() };
    const result = await ProductDAO.insert(product);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.put('/products', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const cid = req.body.category;
    const image = req.body.image;
    const variants = req.body.variants || [];   // array [{size,stock,price}]
    const now = new Date().getTime();

    // Tính toán totalStock
    let totalStock = 0;
    variants.forEach(v => {
      totalStock += parseInt(v.stock) || 0;
    });

    // Kiểm tra category phải là leaf node
    const leaves = await CategoryDAO.selectLeaves();
    const isLeaf = leaves.some((l) => String(l._id) === String(cid));
    if (!isLeaf) {
      return res.status(400).json({ success: false, message: 'Sản phẩm chỉ được gắn vào danh mục cấp cuối (leaf)' });
    }

    const category = await CategoryDAO.selectByID(cid);
    const product = { _id, name, price, image, cdate: now, category, variants, totalStock, updatedAt: new Date() };
    const result = await ProductDAO.update(product);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Lấy sản phẩm theo size (có stock > 0)
router.get('/products/size/:sizeName', JwtUtil.checkToken, async function (req, res) {
  try {
    const { sizeName } = req.params;
    const products = await ProductDAO.selectBySize(sizeName);
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// ===================== CUSTOMER =====================
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});

router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 0);
  res.json(result);
});

router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);
  if (cust) {
    const send = await require('../utils/EmailUtil').send(cust.email, cust._id, cust.token);
    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});

// ===================== ORDER =====================
// Lấy 5 đơn hàng gần đây nhất
router.get('/orders/recent', JwtUtil.checkToken, async function (req, res) {
  try {
    const orders = await OrderDAO.selectRecent(5); // We will add selectRecent to OrderDAO
    res.json(orders);
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});

router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

// test endpoint - get all admins
router.get('/all', async function (req, res) {
  try {
    const admins = await AdminDAO.selectAll();
    res.json({ success: true, data: admins });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// debug endpoint - check config
router.get('/config-debug', (req, res) => {
  const MyConstants = require('../utils/MyConstants');
  res.json({
    DB_SERVER: MyConstants.DB_SERVER,
    DB_USER: MyConstants.DB_USER,
    DB_DATABASE: MyConstants.DB_DATABASE,
    DB_URI_SET: !!MyConstants.DB_URI,
    HAS_PASS: !!MyConstants.DB_PASS,
    VERCEL: !!process.env.VERCEL,
    NODE_ENV: process.env.NODE_ENV
  });
});

// test endpoint - create admin
router.post('/create', async function (req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      const admin = await AdminDAO.insert(username, password);
      res.json({ success: true, message: 'Admin created', data: admin });
    } else {
      res.json({ success: false, message: 'Please provide username and password' });
    }
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ===================== SHIPPING CONFIG =====================
const { store: appStore } = require('../utils/InMemoryStore');
const MyConstants = require('../utils/MyConstants');

// GET current shipping config
router.get('/shipping-config', JwtUtil.checkToken, function (req, res) {
  res.json({ success: true, config: appStore.shippingConfig });
});

// PUT update shipping config
router.put('/shipping-config', JwtUtil.checkToken, function (req, res) {
  try {
    const { fee, freeShipThreshold, estDays, note } = req.body;

    if (fee !== undefined) {
      const n = Number(fee);
      if (isNaN(n) || n < 0) return res.status(400).json({ success: false, message: 'Phí ship không hợp lệ (phải ≥ 0)' });
      appStore.shippingConfig.fee = n;
    }
    if (freeShipThreshold !== undefined) {
      const t = Number(freeShipThreshold);
      if (isNaN(t) || t < 0) return res.status(400).json({ success: false, message: 'Ngưỡng miễn phí ship phải ≥ 0' });
      appStore.shippingConfig.freeShipThreshold = t;
    }
    if (estDays !== undefined) appStore.shippingConfig.estDays = String(estDays).trim();
    if (note    !== undefined) appStore.shippingConfig.note    = String(note).trim();

    appStore.shippingConfig.updatedAt = new Date().toISOString();

    // Also sync to MyConstants so existing checkout.js can read it
    MyConstants.SHIPPING_FEE = appStore.shippingConfig.fee;

    // Emit socket event so connected clients know fee changed
    const io = req.app.get('io');
    if (io) io.emit('shipping_config_updated', appStore.shippingConfig);

    res.json({ success: true, message: 'Cập nhật phí ship thành công', config: appStore.shippingConfig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===================== BANNER =====================
router.get('/banners', JwtUtil.checkToken, async function (req, res) {
  const banners = await BannerDAO.selectAll();
  res.json(banners);
});

router.post('/banners', JwtUtil.checkToken, async function (req, res) {
  const { kicker, title, desc, image, primaryBtnText, primaryBtnLink, secondaryBtnText, secondaryBtnLink, active } = req.body;
  const banner = { kicker, title, desc, image, primaryBtnText, primaryBtnLink, secondaryBtnText, secondaryBtnLink, active };
  const result = await BannerDAO.insert(banner);
  res.json(result);
});

router.put('/banners/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const { kicker, title, desc, image, primaryBtnText, primaryBtnLink, secondaryBtnText, secondaryBtnLink, active } = req.body;
  const banner = { _id, kicker, title, desc, image, primaryBtnText, primaryBtnLink, secondaryBtnText, secondaryBtnLink, active };
  const result = await BannerDAO.update(banner);
  res.json(result);
});

router.delete('/banners/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await BannerDAO.delete(_id);
  res.json(result);
});

module.exports = router;