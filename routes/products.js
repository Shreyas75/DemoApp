const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateBootcamp,
  deleteProduct,
} = require("../controllers/products");

const Product = require("../models/Product");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");




router.get("/", protect, authorize("publisher", "admin"),getProducts)
router.post("/", protect, authorize("publisher", "admin"),createProduct)
router.get("/:id", getProduct)
router.delete("/:id",protect, authorize("publisher", "admin"), deleteProduct)



module.exports = router;
