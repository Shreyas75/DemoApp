const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const colors = require("colors");


// Connect to databse
connectDB();

//Route files
const users = require("./routes/users");
const auth = require("./routes/auth");
const products = require("./routes/products");



const app = express();

// Body Parser
app.use(express.json());


// Mount the routers
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);
app.use("/api/v1/products", products);



const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server and exit process
    server.close(() => process.exit(1));
  });