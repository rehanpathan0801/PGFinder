const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");   // adjust path since it's in backend/models
require("dotenv").config();

const seedAdmin = async () => {
  try {
    // Connect to DB using .env MONGODB_URI
    await mongoose.connect(process.env.MONGODB_URI);

    // Check if admin exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("✅ Admin already exists:", existingAdmin.email);
      process.exit();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Create new admin
    const admin = new User({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
      phone: "0000000000",
      city: "HQ",
    });

    await admin.save();
    console.log("🎉 Admin user created successfully!");
    console.log("👉 Email:", admin.email);
    console.log("👉 Password: admin123");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();
