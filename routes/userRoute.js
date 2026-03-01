
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const {getAllUsers,deleteUser,deleteMe,updateMe,updatePassword} = require("../controller/userController");
const express = require('express');
const router = express.Router();
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllUsers
); 

router.delete(
  "/me",
  protect,
  deleteMe
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

router.patch(
  "/update-me",
  protect,
  updateMe
);

router.patch(
  "/update-password",
  protect,
  updatePassword
);


module.exports = router;