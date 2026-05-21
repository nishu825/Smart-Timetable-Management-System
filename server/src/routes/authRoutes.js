const router = require("express").Router();
const { register, login, getUsers } = require("../controllers/authController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/users", protect, allowRoles("admin", "teacher"), getUsers);

module.exports = router;
