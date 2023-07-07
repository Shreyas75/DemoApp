const ErrorResponse = require("../utils/errorResponse");
const Product = require("../models/Product")
const {sendTokenResponse} = require("../controllers/auth");


// @descr       Get all Products
// @route       GET /api/v1/products
// @access      Public

exports.getProducts = async (req, res, next) => {
    req.body.user = req.user.id
    
    const product = await Product.aggregate([
      { $match: {} }, // Match all documents
      { $project: { _id: 0, name: 1, description: 1, price: 1, category: 1 } } // Include only specific fields
    ]);
  
    res.status(200).json({
      success: true,
      count: product.length,
      data: product,
    });
  };


// @descr       Get single Product
// @route       GET /api/v1/products/:id
// @access      Public

exports.getProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
  
    res.status(200).json({ success: true, data: product });
  };


// @descr       Create new Product
// @route       POST /api/v1/products
// @access      Private

exports.createProduct = async (req,res,next) =>{
    // Add user to req.body 
    req.body.user = req.user.id

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product,
  });
}


// @descr       Delete Bootcamps
// @route       DELETE /api/v1/products/:id
// @access      Private

exports.deleteProduct = async (req,res,next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is product owner
  if (product.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this bootcamp`,
        401
      )
    );
  }

  product.deleteOne();

  res.status(200).json({ success: true, data: {} });

}