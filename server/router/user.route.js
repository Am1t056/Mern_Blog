const router = require("express").Router();

const {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.get("/", getAuthors);
router.post("/changeavatar", authMiddleware, changeAvatar);
router.patch("/edituser", authMiddleware, editUser);

module.exports = router;
