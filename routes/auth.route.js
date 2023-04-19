const { Router } = require("express");
const {
  register,
  login,
  getProfile,
  updateDetails,
  updatePassword,
} = require("../controllers/auth.controller");
const router = Router();
const { protected } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protected, getProfile);
router.put("/update", protected, updateDetails);
router.put("/updatepassword", protected, updatePassword);

module.exports = router;
