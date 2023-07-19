const ErrorResponse = require("../utils/errorResponse");
const Product = require("../models/Product")
const {sendTokenResponse} = require("../controllers/auth");


// @descr       Get all Products
// @route       GET /api/v1/products
// @access      Public

exports.getProducts = async (req, res, next) => {
  req.body.user = req.user.id

  let query;

  // Copy req.query
  const reqQuery = {...req.query}

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over removeFields and delete them from req.query
  removeFields.forEach(param => delete reqQuery[param]);

  

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operators like GT and GTE etc
  queryStr = queryStr.replace(/\b(gt | gte|lt|lte|in)\b/g, match => `$${match}`)
 

  // Finding Resource 
  query = Product.find(JSON.parse(queryStr))

   
  // SELECT FIELDS
  if(req.query.select){
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }else{
    query = query.sort('-createdAt');

  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page-1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments();

  
  query = query.skip(startIndex).limit(limit);

    // Executing query
    const products = await query

    // Pagination result
    const pagination = {};

    if(endIndex < total) {
      pagination.next = {
        page: page+1,
        limit
      }
    }

    if(startIndex > 0) {
      pagination.prev = {
        page: page-1,
        limit
      }
    }

    const product = await Product.aggregate([
      { $match: {} }, // Match all documents
      { $project: { _id: 0, name: 1, description: 1, price: 1 } } // Include only specific fields
    ]);

  
    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products,
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