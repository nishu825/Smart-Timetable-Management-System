const router = require("express").Router();
const controller = require("../controllers/classController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.get("/", controller.getClasses);
router.post("/", protect, allowRoles("admin"), controller.createClass);
router.put("/:id", protect, allowRoles("admin"), controller.updateClass);
router.delete("/:id", protect, allowRoles("admin"), controller.deleteClass);

module.exports = router;
