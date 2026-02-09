import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,   // plain password
  role: {
    type: String,
    enum: ["admin", "manager", "developer"],
    required: true
  },
  isActive: { type: Boolean, default: true }
});

// Compare password method (simple plain check)
userSchema.methods.matchPassword = function (enteredPassword) {
  return enteredPassword === this.password;
};

export default mongoose.model("User", userSchema);