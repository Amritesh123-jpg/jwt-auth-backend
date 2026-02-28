const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

exports.protect = async (req, res, next) => {
  try {
    let token;

    /* ===============================
       1️⃣ TOKEN NIKALO
    ================================ */
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please login first."
      });
    }

    /* ===============================
       2️⃣ TOKEN VERIFY
    ================================ */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* ===============================
       3️⃣ USER EXIST CHECK
    ================================ */
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "User belonging to this token no longer exists."
      });
    }

    /* ===============================
       4️⃣ USER ATTACH
    ================================ */
    req.user = currentUser;

    next(); // 🚀 aage jaane do

  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired token"
    });
  }
};
