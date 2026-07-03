
const authController = require('../controller/authController');
const userController = require("../controller/userController");
const express = require('express');
const router = express.Router();
router.get(
  "/",
  authController.protect,
  authController.restrict("admin"),
  userController.getAllUsers

); 

// router.delete(
//   "/me",
//   protect,
//   deleteMe
// );






module.exports = router;