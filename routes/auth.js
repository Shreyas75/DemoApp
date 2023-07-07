const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.post("/me", getMe)

module.exports = router;
