const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  image: { type: String },
  online: { type: Boolean, default: false },
});
module.exports = mongoose.model("User", userSchema);
