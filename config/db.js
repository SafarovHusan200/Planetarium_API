const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.set("strictQuery", false);
  const connecting = await mongoose.connect(process.env.MONGODB_URI);
  console.log(
    `MongoDB connected to: ${connecting.connection.host}`.bgCyan.bold
  );
};

module.exports = connectDB;
