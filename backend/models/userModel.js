const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: "user" }, //e.g., 'user', 'admin', 'trainer'
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", userSchema);