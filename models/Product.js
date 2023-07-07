const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ["true", "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, "Name cannot be more than 50 characters"],
      },
      description: {
        type: String,
        required: ["true", "Please add a name"],
        maxlength: [500, "Description cannot be more than 500 characters"],
      },
      price: {
        type: Number,
        required: [true, "Please add the Price"]
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
      },
})


module.exports = mongoose.model("Product", ProductSchema);
