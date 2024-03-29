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

// @descr   Get profile User
// @Route   GET /api/v1/auth/profile
// @Access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @descr   Update profile User
// @Route   PUT /api/v1/auth/update
// @Access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const fieldsToUpdate = {
    name: req.body.name || user.name,
    email: req.body.email || user.email,
  };

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// @descr   Update password
// @Route   PUT /api/v1/auth/updatepassword
// @Access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Old password is incorrect", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  const token = user.generateJwtToken();

  res.status(200).json({
    success: true,
    data: user,
    token,
  });
});

// @descr   Payment Balance
// @route   PUT /api/v1/auth/paymentBalance
// @access  Private
exports.paymentBalance = asyncHandler(async (req, res, next) => {
  // CLICK, PAYME
  const user = await User.findById(req.user._id);
  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      balance: user.balance + req.body.payment,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: updateUser,
  });
});

// @descr   Activate Status
// @route   PUT /api/v1/auth/activate
// @access  Private
exports.activateProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const apiCost = process.env.API_COST;
  console.log(user.balance);
  if (user.balance < apiCost) {
    let needMoney = apiCost - user.balance;
    return next(
      new ErrorResponse(
        `Your balance is less than ${apiCost}, You need ${needMoney} more`
      ),
      400
    );
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      balance: user.balance - apiCost,
      isActive: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Your profile successfully activated",
  });
});
