const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");




// @descr       Get all users
// @route       GET /api/v1/auth/users
// @access      Private/Admin
exports.getUsers = async (req, res, next) => {
    const user = await User.find();
  
    res.status(200).json({
      success: true,
      count: user.length,
      data: user,
    });
};


  
// @descr       Create User
// @route       POST /api/v1/auth/users
// @access      Private/Admin

exports.createUser = async (req, res, next) => {
    const user = await User.create(req.body);
  
    res.status(201).json({
      success: true,
      data: user,
    });
  };