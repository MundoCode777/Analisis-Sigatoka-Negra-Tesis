const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      default: null,
    },
    auth_provider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    firebase_uid: {
      type: String,
      default: null,
    },
    photo_url: {
      type: String,
      default: null,
    },
    reset_token: {
      type: String,
      default: null,
    },
    reset_token_expires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);