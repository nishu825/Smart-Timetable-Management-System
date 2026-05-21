const router = require("express").Router();
const controller = require("../controllers/timetableController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.get("/", protect, controller.getTimetable);
router.post("/", protect, allowRoles("admin"), controller.createEntry);
router.post("/auto-generate", protect, allowRoles("admin"), controller.autoGenerate);
router.delete("/clear-all", protect, allowRoles("admin"), controller.clearAllEntries);
router.put("/:id", protect, allowRoles("admin"), controller.updateEntry);
router.delete("/:id", protect, allowRoles("admin"), controller.deleteEntry);

module.exports = router;
