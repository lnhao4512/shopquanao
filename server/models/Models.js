// CLI: npm install mongoose --save
const mongoose = require('mongoose');

// schemas
const AdminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String
}, { versionKey: false });

const CategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
}, { versionKey: false });

const CustomerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    name: String,
    phone: String,
    email: String,
    active: Number,
    token: String,
}, { versionKey: false });

// ── SIZE VARIANT SCHEMA ──────────────────────────────────────────────────────
const VariantSchema = mongoose.Schema({
    size:  { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'], required: true },
    stock: { type: Number, default: 0, min: 0 },
    price: { type: Number, default: null }   // null = dùng giá base của product
}, { versionKey: false, _id: false });

const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,      // giá cơ bản (dùng khi size.price = null)
    image: String,
    cdate: Number,
    category: CategorySchema,
    variants: { type: [VariantSchema], default: [] }, // mảng rỗng = chưa có size
    totalStock: { type: Number, default: 0 },         // tổng số lượng tồn kho
    updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });

// ── CART SCHEMA (GIO HÀNG) ──────────────────────────────────────────────────
const CartItemSchema = mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    size:      { type: String, default: '' },
    quantity:  { type: Number, required: true, min: 1 },
    price:     { type: Number, required: true }
}, { versionKey: false, _id: false });

const CartSchema = mongoose.Schema({
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
    items:     [CartItemSchema],
    updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });

// ── ORDER SCHEMA CHUẨN ───────────────────────────────────────────────────────
const OrderItemSchema = mongoose.Schema({
    productId: String,
    name: String,
    image: String,
    size: String,
    quantity: Number,
    price: Number
}, { versionKey: false, _id: false });

const OrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        street:   { type: String, required: true },
        building: { type: String, default: '' },
        ward:     { type: String, required: true },
        district: { type: String, required: true },
        city:     { type: String, required: true },
        country:  { type: String, default: 'Việt Nam' }
    },
    items: [OrderItemSchema],
    totalAmount:   { type: Number, required: true },
    shippingFee:   { type: Number, default: 70000 },
    paymentMethod: { type: String, enum: ['cod', 'bank_transfer'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    orderStatus:   { type: String, enum: ['processing', 'shipping', 'completed', 'cancelled'], default: 'processing' },
    qrCodeUrl:     { type: String, default: '' },
    bankInfo: {
        accountNo: String,
        bankCode:  String
    },
    paidAt:    { type: Date },
    createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

const BannerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    kicker: String,
    title: String,
    desc: String,
    image: String, // base64 or URL
    primaryBtnText: String,
    primaryBtnLink: String,
    secondaryBtnText: String,
    secondaryBtnLink: String,
    active: { type: Boolean, default: true }
}, { versionKey: false });

// models
const Admin         = mongoose.model('Admin',         AdminSchema);
const Category      = mongoose.model('Category',      CategorySchema);
const Customer      = mongoose.model('Customer',      CustomerSchema);
const Product       = mongoose.model('Product',       ProductSchema);
const Cart          = mongoose.model('Cart',          CartSchema);
const Order         = mongoose.model('Order',         OrderSchema);
const Banner        = mongoose.model('Banner',        BannerSchema);

// CheckoutOrder was renamed to Order but export both aliases for transition
const CheckoutOrder = mongoose.model('CheckoutOrder', OrderSchema, 'orders'); // map to same collection for safety

module.exports = { Admin, Category, Customer, Product, Cart, Order, CheckoutOrder, Banner };