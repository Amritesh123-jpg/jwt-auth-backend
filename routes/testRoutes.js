const express = require('express');
const { protect,authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Protected route working',
    user: req.user
  });
});

router.get(
  "/admin-only",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.status(200).json({
      status: "success",
      message: "Welcome Admin 🔥"
    });
  }
);


module.exports = router;