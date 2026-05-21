const mongoose = require("mongoose");

const classRoomSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    semester: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClassRoom", classRoomSchema);
