const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Subject = require("./models/Subject");
const ClassRoom = require("./models/ClassRoom");
const Timetable = require("./models/Timetable");
const Attendance = require("./models/Attendance");
const Substitution = require("./models/Substitution");

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany(),
    Subject.deleteMany(),
    ClassRoom.deleteMany(),
    Timetable.deleteMany(),
    Attendance.deleteMany(),
    Substitution.deleteMany()
  ]);

  const password = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Admin User",
    email: "admin@bca.com",
    password,
    role: "admin"
  });

  console.log("Database reset complete");
  console.log("Only admin account is created");
  console.log("Email: admin@bca.com");
  console.log("Password: 123456");
  process.exit();
};

seed();
