const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHandler = require("./middlewares/error");
const colors = require("colors");
const path = require("path");
const connectDB = require("./config/db");

// Initialize env variables
dotenv.config();

// Connection to database
connectDB();

// App instance
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Register routes
app.use("/api/v1/auth", require("./routes/auth.route"));
// Star route
app.use("/api/v1/stars", require("./routes/star.route"));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} on port: ${PORT}`.blue.bold
  )
);
