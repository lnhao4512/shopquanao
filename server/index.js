require('dotenv').config();
const express = require('express');
const app = express();

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

// ── Socket.io (only for local dev) ───────────────────────────────────────────
if (!process.env.VERCEL) {
  const http = require('http');
  const { Server } = require('socket.io');
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3002',
        'http://localhost:3001'
      ],
      methods: ['GET', 'POST']
    }
  });
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
}

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/admin',    require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));
app.use('/api/customer', require('./api/cart.js'));
app.use('/api',          require('./api/checkout.js'));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// ── Error handling ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

module.exports = app;
