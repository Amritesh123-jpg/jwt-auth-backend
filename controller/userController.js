const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");
const signToken = require("../utils/signToken");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({role: "user"}).select("-password");

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users
      }
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

exports.deleteMe = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      status: "success",
      message: "Your account has been deleted"
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

exports.updateMe = async (req, res) => {
  try {

    // 1️⃣ Block password update here
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "This route is not for password updates"
      });
    }

    // 2️⃣ Filter allowed fields
    const filteredBody = filterObj(req.body, "name", "email");

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser
      }
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, passwordConfirm } = req.body;

    // 1️⃣ Get user with password
    const user = await User.findById(req.user.id).select("+password");

    // 2️⃣ Check current password
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Current password is incorrect"
      });
    }

    // 3️⃣ Set new password
    user.password = newPassword;
    user.passwordConfirm = passwordConfirm;

    await user.save(); // pre-save middleware hash karega

    // 4️⃣ New JWT
    const token = signToken(user._id, user.role);

    res.status(200).json({
      status: "success",
      token
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};