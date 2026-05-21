const Attendance = require("../models/Attendance");
const User = require("../models/User");

exports.markAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    const result = await Attendance.findById(attendance._id)
      .populate("classId", "className")
      .populate("subjectId", "subjectName")
      .populate("teacherId", "name")
      .populate("students.studentId", "name email");

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  const filter = {};
  if (req.query.classId) filter.classId = req.query.classId;
  if (req.query.subjectId) filter.subjectId = req.query.subjectId;
  if (req.query.teacherId) filter.teacherId = req.query.teacherId;
  if (req.query.date) filter.date = req.query.date;

  const records = await Attendance.find(filter)
    .populate("classId", "className")
    .populate("subjectId", "subjectName")
    .populate("teacherId", "name")
    .populate("students.studentId", "name email")
    .sort("-createdAt");

  res.json(records);
};

exports.getStudentsByClass = async (req, res) => {
  const students = await User.find({ role: "student", classId: req.params.classId }).select("-password");
  res.json(students);
};

exports.getReport = async (req, res) => {
  const filter = {};
  if (req.query.classId) filter.classId = req.query.classId;
  if (req.query.subjectId) filter.subjectId = req.query.subjectId;
  if (req.query.date) filter.date = req.query.date;

  const records = await Attendance.find(filter);
  let present = 0;
  let absent = 0;

  records.forEach((record) => {
    record.students.forEach((student) => {
      if (student.status === "Present") present += 1;
      if (student.status === "Absent") absent += 1;
    });
  });

  const totalStudents = present + absent;
  const attendancePercentage = totalStudents ? Math.round((present / totalStudents) * 100) : 0;

  res.json({ totalStudents, present, absent, attendancePercentage, recordsCount: records.length });
};
