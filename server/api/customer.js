const express = require('express');
const router = express.Router();
// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');
// daos
const CustomerDAO = require('../models/CustomerDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const BannerDAO = require('../models/BannerDAO');

// customer signup
router.post('/signup', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);
    if (dbCust) {
        res.json({ success: false, message: 'Exists username or email' });
    } else {
        const now = new Date().getTime();
        const token = CryptoUtil.md5(now.toString());
        const newCust = { username, password, name, phone, email, active: 0, token };
        const result = await CustomerDAO.insert(newCust);
        if (result) {
            const send = await EmailUtil.send(email, result._id, token);
            res.json({
                success: true,
                message: send
                    ? 'Đăng ký thành công. Kiểm tra email hoặc nhập mã kích hoạt bên dưới tại trang Activate.'
                    : 'Đăng ký thành công. Dùng Account ID và mã kích hoạt để kích hoạt tài khoản.',
                id: result._id,
                activationToken: token,
                emailSent: Boolean(send)
            });
        } else {
            res.json({ success: false, message: 'Insert failure' });
        }
    }
});

// customer active
router.post('/active', async function (req, res) {
    const _id = req.body.id;
    const token = req.body.token;
    const result = await CustomerDAO.active(_id, token, 1);
    res.json(result);
});

// customer login
router.post('/login', async function (req, res) {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '').trim();
    if (username && password) {
        const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);
        if (customer) {
            if (customer.active === 1) {
                const token = JwtUtil.genToken();
                res.json({ success: true, message: 'Authentication successful', token, customer });
            } else {
                res.json({ success: false, message: 'Tài khoản chưa kích hoạt. Vui lòng nhập Account ID và mã kích hoạt tại trang Activate, sau đó mới đăng nhập được.' });
            }
        } else {
            res.json({ success: false, message: 'Incorrect username or password' });
        }
    } else {
        res.json({ success: false, message: 'Please input username and password' });
    }
});

// customer token check
router.get('/token', JwtUtil.checkToken, function (req, res) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    res.json({ success: true, message: 'Token is valid', token });
});

// customer update profile
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const customer = { _id, username, password, name, phone, email };
    const result = await CustomerDAO.update(customer);
    res.json(result);
});

// category - flat list
router.get('/categories', async function (req, res) {
    try {
        const categories = await CategoryDAO.selectAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// category - dạng cây (tree) cho multi-level menu
router.get('/categories/tree', async function (req, res) {
    try {
        const tree = await CategoryDAO.selectTree();
        res.json(tree);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// product - all
router.get('/products', async function (req, res) {
    try {
        const products = await ProductDAO.selectAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// product
router.get('/products/new', async function (req, res) {
    const products = await ProductDAO.selectTopNew(3);
    res.json(products);
});
router.get('/products/hot', async function (req, res) {
    const products = await ProductDAO.selectTopHot(3);
    res.json(products);
});
router.get('/products/category/:cid', async function (req, res) {
    try {
        const _cid = req.params.cid;
        // Lấy tất cả ID con cháu (bao gồm chính nó)
        const allIds = await CategoryDAO.selectDescendantIds(_cid);
        const products = await ProductDAO.selectByCatIDs(allIds);
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
router.get('/products/search/:keyword', async function (req, res) {
    const keyword = req.params.keyword;
    const products = await ProductDAO.selectByKeyword(keyword);
    res.json(products);
});
// Lọc sản phẩm theo size (stock > 0)
router.get('/products/size/:sizeName', async function (req, res) {
    try {
        const { sizeName } = req.params;
        const products = await ProductDAO.selectBySize(sizeName);
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
router.get('/products/:id', async function (req, res) {
    const _id = req.params.id;
    const product = await ProductDAO.selectByID(_id);
    res.json(product);
});

// mycart - checkout
router.post('/checkout', JwtUtil.checkToken, async function (req, res) {
    const now = new Date().getTime();
    const total = req.body.total;
    const items = req.body.items;
    const customer = req.body.customer;
    const order = { cdate: now, total: total, status: 'PENDING', customer: customer, items: items };
    const result = await OrderDAO.insert(order);
    res.json(result);
});

// myorders by customer id
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
});

// banner
router.get('/banners', async function (req, res) {
    const banners = await BannerDAO.selectAll();
    res.json(banners);
});

module.exports = router;

