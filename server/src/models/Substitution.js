const mongoose = require("mongoose");

const substitutionSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "ClassRoom", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    originalTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    substituteTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    timeSlot: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Substitution", substitutionSchema);
