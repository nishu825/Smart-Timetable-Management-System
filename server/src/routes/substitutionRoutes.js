const router = require("express").Router();
const controller = require("../controllers/substitutionController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.get("/", protect, controller.getSubstitutions);
router.post("/", protect, allowRoles("admin"), controller.createSubstitution);
router.delete("/:id", protect, allowRoles("admin"), controller.deleteSubstitution);

module.exports = router;
