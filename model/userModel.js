console.log("✅ userModel loaded");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
  },

  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please provide valid email! 😐"],
  },

  password: {
    type: String,
    required: [true, "User must have a password"],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  passwordChangedAt: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

/// Hash Password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

/// Update Password Changed Time
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return;

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/// Query Middleware (Soft Delete)
userSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
  
});

/// Compare Password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/// Check if Password Changed After JWT Issued
userSchema.methods.passwordChangedAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;