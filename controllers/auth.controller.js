const User = require("../models/user.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const uuid = require("uuid");

// @descr   Register new user
// @Route   POST /api/v1/auth/register
// @Access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const apiKey = uuid.v4();
  const user = await User.create({
    name,
    email,
    password,
    apiKey,
  });

  const token = user.generateJwtToken();

  res.status(201).json({
    success: true,
    data: user,
    token,
  });
});

// @descr   Login
// @Route   POST /api/v1/auth/login
// @Access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email && password
  if (!email || !password) {
    return next(new ErrorResponse("please provide email and password", 400));
  }
  const user = await User.findOne({ email });

  // Check for the user
  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  // Check for password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  const token = user.generateJwtToken();

  res.status(200).json({
    success: true,
    message: user,
    token,
  });
});
