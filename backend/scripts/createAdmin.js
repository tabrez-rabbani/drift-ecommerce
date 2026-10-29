/**
 * ─────────────────────────────────────────────
 *  Drift — Admin Seed Script
 *  Creates or updates an admin user in MongoDB
 *
 *  Usage:
 *    node scripts/createAdmin.js
 *
 *  How to run:
 *    1. Set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD below
 *    2. Open terminal in Backend folder
 *    3. Run:  node scripts/createAdmin.js
 * ─────────────────────────────────────────────
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// ─── Load .env from Backend root ────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

// ─────────────────────────────────────────────────
//  ✏️  SET YOUR ADMIN CREDENTIALS HERE
// ─────────────────────────────────────────────────
const ADMIN_NAME     = "Tabrez";
const ADMIN_EMAIL    = "tabrez.devx@gmail.com";
const ADMIN_PASSWORD = "tabrez12";
// ─────────────────────────────────────────────────

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI not found in .env");
  process.exit(1);
}

// Minimal user schema (no need to import full model chain)
const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    email:        { type: String, required: true, unique: true, lowercase: true },
    password:     { type: String },
    role:         { type: String, enum: ["buyer", "admin"], default: "buyer" },
    googleId:     { type: String },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      // Update role + password if user already exists
      existing.role     = "admin";
      existing.name     = ADMIN_NAME;
      existing.password = hashed;
      await existing.save();
      console.log(`Existing user updated as Admin → ${ADMIN_EMAIL}`);
    } else {
      // Create fresh admin
      await User.create({
        name:     ADMIN_NAME,
        email:    ADMIN_EMAIL,
        password: hashed,
        role:     "admin",
      });
      console.log(`Admin created successfully → ${ADMIN_EMAIL}`);
    }

    console.log("─────────────────────────────────────────");
    console.log("  Email   :", ADMIN_EMAIL);
    console.log("  Password: (as set in script)");
    console.log("  Role    : admin");
    console.log("─────────────────────────────────────────");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌  Disconnected from MongoDB");
    process.exit(0);
  }
}

run();
