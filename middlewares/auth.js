const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const errorResponse = require("../utils/errorResponse");
const User = require("../models/user.model");
const ErrorResponse = require("../utils/errorResponse");

//  Protecting routes
exports.protected = asyncHandler(async (req, res, next) => {
  let token;

  // Authorization: <type> <credeentials> Bearar crbeiubvr.erfierbvre
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ErrorResponse("Not authorization to access this route"),
      401
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

  req.user = await User.findById(decoded.id);
  next();
});

// Grant access to admins
exports.adminAccess = (req, res, next) => {
  console.log(req.user);
  if (!req.user.adminStatus) {
    return next(
      new ErrorResponse("This route can be access only admin status users"),
      403
    );
  }
  next();
};

// API Key Access
exports.apiKeyAccess = asyncHandler(async (req, res, next) => {
  let key;
  // Check header for api key
  if (req.headers["apikey"]) {
    key = req.headers["apikey"];
  }

  if (!key) {
    return next(new errorResponse("No API Key to access this route", 403));
  }

  const user = await User.findOne({ apiKey: key });

  // chack if user exist
  if (!user) {
    return next(new errorResponse("No user found by this API Key"), 400);
  }

  // Check if user status active
  if (!user.isActive) {
    return next(
      new ErrorResponse("Please activate your status to get response"),
      403
    );
  }

  next();
});
