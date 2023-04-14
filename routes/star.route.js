const { Router } = require("express");
const {
  getAllStar,
  createNewStar,
  getStarById,
  updateStar,
  deleteStar,
} = require("../controllers/star.controller");
const router = Router();

router.get("/", getAllStar);
router.post("/", createNewStar);
router.get("/:id", getStarById);
router.put("/:id", updateStar);
router.delete("/:id", deleteStar);

module.exports = router;
