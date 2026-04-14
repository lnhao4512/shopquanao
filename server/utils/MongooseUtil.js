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

mongoose
  .connect(uri)
  .then(() => {
    console.log("SUCCESS: Database connected successfully to " + (uri.includes('@') ? uri.split('@')[1] : uri));
  })
  .catch((err) => {
    console.error("FATAL ERROR: Database connection failed!");
    console.error("URI attempted:", uri.replace(/:([^@]+)@/, ':****@')); // Hide password in logs
    console.error("Error Detail:", err.message);
  });
