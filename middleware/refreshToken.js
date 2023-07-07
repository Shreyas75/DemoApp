const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");



//Protect routes
exports.refreshToken = async (req, res, next) => {
    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log(token)
    
  
    // Make sure token exists
    if (!token) {
      return next(new ErrorResponse("Not authorized to access this route", 401));
    }
    console.log(token)
  
    try {
      
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded)
      decoded.exp =  Math.floor(Date.now() / 1000) + (60 * 10); // Set expiration to 10 minutes from now
      const updatedToken = jwt.sign(decoded, process.env.JWT_SECRET)
      console.log(updatedToken)
        
      req.user = await User.findById(decoded.id);
      res.cookie("token", updatedToken);
      
    } catch (error) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
      
    }
    next();
  };