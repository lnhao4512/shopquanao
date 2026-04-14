//CLI: npm install mongoose --save
const mongoose = require("mongoose");
const MyConstants = require("./MyConstants");
// Prefer explicit URI when provided. Otherwise, build a safe default.
let uri = MyConstants.DB_URI ? MyConstants.DB_URI.trim() : null;

if (!uri) {
  const user     = encodeURIComponent(String(MyConstants.DB_USER || '').trim());
  const pass     = encodeURIComponent(String(MyConstants.DB_PASS || '').trim());
  const server   = String(MyConstants.DB_SERVER || '').trim();
  const database = String(MyConstants.DB_DATABASE || '').trim();

  if (user && server) {
    // Standard Atlas SRV connection string
    uri = `mongodb+srv://${user}:${pass}@${server}/${database}?retryWrites=true&w=majority`;
  } else {
    // Local default (no auth)
    uri = `mongodb://127.0.0.1:27017/${database || 'test'}`;
  }
}

let conn = null;

async function connectDB() {
    if (conn) return conn;
    
    console.log("Starting database connection attempt...");
    conn = await mongoose.connect(uri, {
        bufferCommands: false, // Disable buffering to catch connection issues immediately
        connectTimeoutMS: 15000,
        socketTimeoutMS: 30000
    });
    console.log("SUCCESS: Database connected successfully.");
    return conn;
}

// Still initiate connection at top level
connectDB().catch(err => console.error("Initial connection failed:", err.message));

module.exports = { connectDB };
