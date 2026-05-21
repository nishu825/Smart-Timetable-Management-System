const Timetable = require("../models/Timetable");
const Subject = require("../models/Subject");
const Substitution = require("../models/Substitution");

const populateTimetable = (query) =>
  query
    .populate("classId", "className")
    .populate("subjectId", "subjectName")
    .populate("teacherId", "name email");

const findClash = async ({ classId, teacherId, day, timeSlot, ignoreId }) => {
  const base = { day, timeSlot };
  if (ignoreId) base._id = { $ne: ignoreId };

  const teacherClash = await Timetable.findOne({ ...base, teacherId });
  if (teacherClash) {
    return "Teacher is already assigned to another class at this time";
  }

  const classClash = await Timetable.findOne({ ...base, classId });
  if (classClash) {
    return "This class already has another subject at this time";
  }

  return null;
};

exports.createEntry = async (req, res) => {
  try {
    const clashMessage = await findClash(req.body);
    if (clashMessage) return res.status(400).json({ message: clashMessage });

    const entry = await Timetable.create(req.body);
    const populatedEntry = await populateTimetable(Timetable.findById(entry._id));
    res.status(201).json(populatedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTimetable = async (req, res) => {
  const filter = {};
  if (req.query.classId) filter.classId = req.query.classId;
  if (req.query.teacherId) filter.teacherId = req.query.teacherId;
  if (req.query.day) filter.day = req.query.day;

  let entries = await populateTimetable(Timetable.find(filter).sort("day timeSlot")).lean();

  if (req.query.date) {
    const substitutions = await Substitution.find({ date: req.query.date })
      .populate("substituteTeacherId", "name email")
      .lean();

    entries = entries.map((entry) => {
      const sub = substitutions.find(
        (item) =>
          item.classId.toString() === entry.classId._id.toString() &&
          item.subjectId.toString() === entry.subjectId._id.toString() &&
          item.timeSlot === entry.timeSlot
      );

      return sub
        ? { ...entry, displayTeacher: sub.substituteTeacherId, isSubstituted: true }
        : { ...entry, displayTeacher: entry.teacherId, isSubstituted: false };
    });
  }

  res.json(entries);
};

exports.updateEntry = async (req, res) => {
  try {
    const clashMessage = await findClash({ ...req.body, ignoreId: req.params.id });
    if (clashMessage) return res.status(400).json({ message: clashMessage });

    const entry = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const populatedEntry = await populateTimetable(Timetable.findById(entry._id));
    res.json(populatedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEntry = async (req, res) => {
  await Timetable.findByIdAndDelete(req.params.id);
  res.json({ message: "Timetable entry deleted" });
};

exports.clearAllEntries = async (req, res) => {
  await Timetable.deleteMany({});
  await Substitution.deleteMany({});
  res.json({ message: "All timetable entries cleared" });
};

exports.autoGenerate = async (req, res) => {
  try {
    const { classIds, subjectIds, days, timeSlots, clearExisting } = req.body;
    if (!classIds?.length || !subjectIds?.length || !days?.length || !timeSlots?.length) {
      return res.status(400).json({ message: "classIds, subjectIds, days and timeSlots are required" });
    }

    const subjects = await Subject.find({ _id: { $in: subjectIds } });
    if (!subjects.length) return res.status(400).json({ message: "No valid subjects found" });

    if (clearExisting) {
      await Timetable.deleteMany({ classId: { $in: classIds } });
    }

    const created = [];
    let subjectIndex = 0;

    for (const classId of classIds) {
      for (const day of days) {
        for (const timeSlot of timeSlots) {
          let placed = false;

          for (let attempt = 0; attempt < subjects.length; attempt++) {
            const subject = subjects[(subjectIndex + attempt) % subjects.length];
            const clashMessage = await findClash({
              classId,
              subjectId: subject._id,
              teacherId: subject.teacherId,
              day,
              timeSlot
            });

            if (!clashMessage) {
              const entry = await Timetable.create({
                classId,
                subjectId: subject._id,
                teacherId: subject.teacherId,
                day,
                timeSlot
              });
              created.push(entry);
              subjectIndex = (subjectIndex + attempt + 1) % subjects.length;
              placed = true;
              break;
            }
          }

          if (!placed) {
            return res.status(400).json({
              message: `Could not fill ${day} ${timeSlot}. Add more teachers/subjects or reduce slots.`,
              createdCount: created.length
            });
          }
        }
      }
    }

    const result = await populateTimetable(Timetable.find({ _id: { $in: created.map((item) => item._id) } }));
    res.status(201).json({ message: "Timetable generated successfully", createdCount: created.length, entries: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
