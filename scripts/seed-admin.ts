/**
 * One-time admin seeder.
 * Usage:  pnpm run seed:admin
 *
 * Set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD in .env before running.
 * Idempotent: skips creation if an admin with that email already exists.
 */

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../lib/mongodb";
import User from "../models/User";
import { UserRole } from "../types";

async function main() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!name || !email || !password) {
    console.error(
      "❌  ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must all be set in .env",
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌  ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.role !== UserRole.ADMIN) {
      console.error(
        `❌  A non-admin account already exists for ${email}. Change ADMIN_EMAIL in .env.`,
      );
      await mongoose.disconnect();
      process.exit(1);
    }
    console.log(`ℹ️   Admin already exists for ${email}. Nothing to do.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  // Password is hashed automatically by the User model pre-save hook.
  await User.create({
    name,
    email,
    password,
    role: UserRole.ADMIN,
    isActive: true,
  });

  console.log(`✅  Admin account created successfully.`);
  console.log(`    Email   : ${email}`);
  console.log(`    Password: (as set in ADMIN_PASSWORD)`);
  console.log(`    Login at: http://localhost:3000/login`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  mongoose.disconnect().finally(() => process.exit(1));
});
