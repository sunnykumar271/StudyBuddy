const mongoose = require('mongoose');
const dns = require('dns');

// ─── Fix: Local router DNS (gpon.net / fe80::1) cannot resolve MongoDB Atlas
// SRV records. Override to use Google Public DNS before any connection attempt.
dns.setDefaultResultOrder('ipv4first');   // prefer IPv4 answers
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); // Google + Cloudflare DNS

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,        // 👈 Force IPv4 — avoids fe80::1 IPv6 local DNS
    });
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;