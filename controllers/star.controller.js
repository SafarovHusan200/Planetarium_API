const Star = require("../models/star.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @descr   Geet all starts
// @Route   GET /api/v1/stars
// @Access  Public / with apiKey
exports.getAllStar = asyncHandler(async (req, res, next) => {
  const stars = await Star.find();

  res.status(200).json({
    success: true,
    data: stars,
  });
});

// @descr   Geet all starts
// @Route   GET /api/v1/stars
// @Access  Public / with apiKey
exports.getStarById = asyncHandler(async (req, res, next) => {
  const star = await Star.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: star,
  });
});

// @descr   Post all starts
// @Route   GET /api/v1/stars
// @Access  Private / Admin
exports.createNewStar = asyncHandler(async (req, res, next) => {
  const { name, temprature, massa, diametr } = req.body;
  const newStar = await Star.create({
    name,
    temprature,
    massa,
    diametr,
    image: "uploads/" + req.file.filename,
  });

  res.status(200).json({
    success: true,
    data: newStar,
  });
});

// @descr   Update star
// @Route   PUT /api/v1/stars/:id
// @Access  Private / Admin
exports.updateStar = asyncHandler(async (req, res, next) => {
  const star = await Star.findById(req.params.id);

  const editedStar = {
    name: req.body.name || star.name,
    temprature: req.body.temprature || star.temprature,
    massa: req.body.massa || star.massa,
    diametr: req.body.diametr || star.diametr,
    image: req.body.image || star.image,
  };

  const updatedStar = await Star.findByIdAndUpdate(req.params.id, editedStar, {
    new: true,
  });

  res.status(200).json({
    status: true,
    data: updatedStar,
  });
});

// @descr   delete star
// @Route   DELETE /api/v1/stars/:id
// @Access  Private / Admin
exports.deleteStar = asyncHandler(async (req, res, next) => {
  await Star.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    message: "Delete Successfully",
  });
});
