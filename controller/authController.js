const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signToken = require("../utils/signToken");

/* ===============================
   JWT TOKEN GENERATOR
================================ */
// const signToken = (id,role) => {
//   return jwt.sign(
//     { id,role },
//      process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };

/* ===============================
   SIGNUP
================================ */
exports.signUp = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      
    });

    // 🔐 token generate
    const token = signToken(user._id,user.role);

    // password response me mat bhejo
    user.password = undefined;

    res.status(201).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

/* ===============================
   LOGIN
================================ */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ check email & password
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    // 2️⃣ find user + password
    const user = await User.findOne({ email }).select("+password");

    // 3️⃣ user exist & password match?
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    // 🔐 token generate
    const token = signToken(user._id,user.role);

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }

 
};
