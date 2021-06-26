const mongoose = require("mongoose");
const { isEmail } = require("validator");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, "Please enter valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Minimum password length is 6 characters"],
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
