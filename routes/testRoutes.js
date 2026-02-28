const express = require('express');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Protected route working',
    user: req.user
  });
});

module.exports = router;