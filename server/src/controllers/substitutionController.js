const Substitution = require("../models/Substitution");

exports.createSubstitution = async (req, res) => {
  try {
    const existing = await Substitution.findOne({
      date: req.body.date,
      classId: req.body.classId,
      subjectId: req.body.subjectId,
      timeSlot: req.body.timeSlot
    });

    if (existing) {
      return res.status(400).json({ message: "Substitution already exists for this lecture" });
    }

    const substitution = await Substitution.create(req.body);
    const result = await Substitution.findById(substitution._id)
      .populate("classId", "className")
      .populate("subjectId", "subjectName")
      .populate("originalTeacherId", "name")
      .populate("substituteTeacherId", "name");

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubstitutions = async (req, res) => {
  const filter = {};
  if (req.query.date) filter.date = req.query.date;

  const substitutions = await Substitution.find(filter)
    .populate("classId", "className")
    .populate("subjectId", "subjectName")
    .populate("originalTeacherId", "name")
    .populate("substituteTeacherId", "name")
    .sort("-createdAt");

  res.json(substitutions);
};

exports.deleteSubstitution = async (req, res) => {
  await Substitution.findByIdAndDelete(req.params.id);
  res.json({ message: "Substitution deleted" });
};
