const Planet = require("../models/planet.model");
const Star = require("../models/star.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @descr   Geet all planets
// @Route   GET /api/v1/planets
// @Access  Public / with apiKey
exports.getAllPlanets = asyncHandler(async (req, res, next) => {
  const planets = await Planet.find();

  res.status(200).json({
    success: true,
    data: planets,
  });
});

// @descr   Get one Planets ById
// @Route   GET /api/v1/planets/:id
// @Access  Public / with apiKey
exports.getPlanetById = asyncHandler(async (req, res, next) => {
  const planet = await Planet.findById(req.params.id);

  res.status(200).json({
    seccuss: true,
    data: planet,
  });
});

// @descr   Create new Planet
// @Route   POST /api/v1/planets
// @Access  Private/Admin
exports.createPlanet = asyncHandler(async (req, res, next) => {
  const star = await Star.findOne({ name: req.body.star });
  const newPlanet = await Planet.create({
    name: req.body.name,
    distanceToStar: req.body.distanceToStar,
    diametr: req.body.diametr,
    yearDuration: req.body.yearDuration,
    dayDuration: req.body.dayDuration,
    temperature: req.body.temperature,
    sequenceNumber: req.body.sequenceNumber,
    satellites: req.body.satellites,
    image: "upload/" + req.file.filename,
    star: star._id,
  });

  await Star.findOneAndUpdate(
    { name: req.body.star },
    { $push: { planets: newPlanet._id } },
    { new: true, upsert: true }
  );

  res.status(201).json({
    success: true,
    data: newPlanet,
  });
});

// @descr   Update planet
// @Route   PUT /api/v1/stars/:id
// @Access  Private / Admin
exports.updatePlanet = asyncHandler(async (req, res, next) => {
  const planet = await Planet.findById(req.params.id);

  const editedPlanet = {
    name: req.body.name || planet.name,
    distanceToStar: req.body.distanceToStar || planet.distanceToStar,
    diametr: req.body.diametr || planet.diametr,
    yearDuration: req.body.yearDuration || planet.yearDuration,
    dayDuration: req.body.dayDuration || planet.dayDuration,
    satellites: req.body.satellites || planet.satellites,
    temperature: req.body.temperature || planet.temperature,
    sequenceNumber: req.body.sequenceNumber || planet.sequenceNumber,
  };

  const updatedPlanet = await Planet.findByIdAndUpdate(
    req.params.id,
    editedPlanet,
    {
      new: true,
    }
  );

  res.status(200).json({
    status: true,
    data: updatedPlanet,
  });
});

// @descr   Delete planet
// @Route   DELETE /api/v1/stars/:id
// @Access  Private / Admin
exports.deletePlanet = asyncHandler(async (req, res, next) => {
  await Planet.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    message: "Planet deleted!",
  });
});
