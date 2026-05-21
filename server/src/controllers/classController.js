const ClassRoom = require("../models/ClassRoom");

exports.createClass = async (req, res) => {
  try {
    const existingClass = await ClassRoom.findOne({
      className: req.body.className,
      semester: req.body.semester
    });

    if (existingClass) {
      return res.status(400).json({ message: "This class and semester already exist" });
    }

    const classRoom = await ClassRoom.create(req.body);
    res.status(201).json(classRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClasses = async (req, res) => {
  const classes = await ClassRoom.find().sort("className semester");
  res.json(classes);
};

exports.updateClass = async (req, res) => {
  const classRoom = await ClassRoom.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(classRoom);
};

exports.deleteClass = async (req, res) => {
  await ClassRoom.findByIdAndDelete(req.params.id);
  res.json({ message: "Class deleted" });
};
