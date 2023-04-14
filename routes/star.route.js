const { Router } = require("express");
const {
  getAllStar,
  createNewStar,
  getStarById,
  updateStar,
  deleteStar,
} = require("../controllers/star.controller");
const upload = require("../utils/fileUpload");
const router = Router();

router.get("/", getAllStar);
router.post("/", upload.single("image"), createNewStar);
router.get("/:id", getStarById);
router.put("/:id", updateStar);
router.delete("/:id", deleteStar);

module.exports = router;
