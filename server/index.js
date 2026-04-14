require('dotenv').config();
const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');

const app    = express();
const server = http.createServer(app);

// ── Socket.io ────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',  // admin
      'http://localhost:3002',  // customer
      'http://localhost:3001'
    ],
    methods: ['GET', 'POST']
  }
});

// Make io available to route handlers via req.app.get('io')
app.set('io', io);

io.on('connection', (socket) => {
  console.log('[Socket.io] Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('[Socket.io] Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// ── Middlewares ──────────────────────────────────────────────────────────────
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const path = require('path');

// ── Serving static files ─────────────────────────────────────────────────────
// Customer build
app.use(express.static(path.join(__dirname, '../client-customer/build')));
// Admin build (served at /admin)
app.use('/admin', express.static(path.join(__dirname, '../client-admin/build')));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/admin',    require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));
app.use('/api/customer', require('./api/cart.js'));       // cart routes
app.use('/api',          require('./api/checkout.js'));    // new checkout routes

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Admin SPA routing - fallback to admin/index.html
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client-admin/build', 'index.html'));
});

// Customer SPA routing - fallback to customer/index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client-customer/build', 'index.html'));
});

// ── Error handling ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

module.exports = app; // For Vercel
