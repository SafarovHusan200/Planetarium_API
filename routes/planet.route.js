const { Router } = require("express");
const {
  getAllPlanets,
  createPlanet,
  getPlanetById,
  updatePlanet,
  deletePlanet,
} = require("../controllers/planet.controller");
const upload = require("../utils/fileUpload");
const router = Router();

router.get("/", getAllPlanets);
router.post("/", upload.single("image"), createPlanet);
router.get("/:id", getPlanetById);
router.put("/:id", updatePlanet);
router.delete("/:id", deletePlanet);

module.exports = router;
