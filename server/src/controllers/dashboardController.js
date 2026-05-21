const ClassRoom = require("../models/ClassRoom");
const Subject = require("../models/Subject");
const User = require("../models/User");

exports.getStats = async (req, res) => {
  const [totalClasses, totalSubjects, totalTeachers] = await Promise.all([
    ClassRoom.countDocuments(),
    Subject.countDocuments(),
    User.countDocuments({ role: "teacher" })
  ]);

  res.json({ totalClasses, totalSubjects, totalTeachers });
};
