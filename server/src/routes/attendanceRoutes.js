const router = require("express").Router();
const controller = require("../controllers/attendanceController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.get("/", protect, allowRoles("admin", "teacher"), controller.getAttendance);
router.post("/", protect, allowRoles("teacher"), controller.markAttendance);
router.get("/students/:classId", protect, allowRoles("admin", "teacher"), controller.getStudentsByClass);
router.get("/report", protect, allowRoles("admin", "teacher"), controller.getReport);

module.exports = router;
