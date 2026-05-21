const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "ClassRoom", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    students: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["Present", "Absent"], required: true }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
