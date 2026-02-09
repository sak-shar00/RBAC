import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    // Delete old admin
    await User.deleteMany({ email: "admin@gmail.com" });

    // Create admin with plain password
    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: "123456",
      role: "admin"
    });

    console.log("Admin created successfully with plain password!");
    process.exit();
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
};

seedAdmin();