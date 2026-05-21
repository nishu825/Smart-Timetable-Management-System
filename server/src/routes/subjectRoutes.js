const router = require("express").Router();
const controller = require("../controllers/subjectController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.get("/", protect, controller.getSubjects);
router.post("/", protect, allowRoles("admin"), controller.createSubject);
router.put("/:id", protect, allowRoles("admin"), controller.updateSubject);
router.delete("/:id", protect, allowRoles("admin"), controller.deleteSubject);

module.exports = router;
