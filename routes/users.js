const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const User = require("../models/User");

const router = express.Router({ mergeParams: true });

router.route("/").get(getUsers).post(createUser);

module.exports = router;