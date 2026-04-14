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

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new database connection promise...");
    const opts = {
      bufferCommands: true, // MUST be true for serverless stability
      connectTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log("SUCCESS: Database connected.");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset if failed so we can try again
    console.error("Connection failed during await:", e.message);
    throw e;
  }

  return cached.conn;
}

// Initial call
connectDB().catch(err => console.error("Startup DB error:", err.message));

module.exports = { connectDB };
