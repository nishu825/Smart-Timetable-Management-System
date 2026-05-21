import { useEffect, useState } from "react";
import api from "../api/axios";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const defaultSlots = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-01:00"];

const classLabel = (item) => `${item.className} - Semester ${item.semester}`;

const AdminPanel = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState("");
  const [newClass, setNewClass] = useState({ className: "", semester: "1" });
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", password: "123456" });
  const [newSubject, setNewSubject] = useState({ subjectName: "", teacherId: "" });
  const [entry, setEntry] = useState({ classId: "", subjectId: "", teacherId: "", day: "Monday", timeSlot: "09:00-10:00" });
  const [auto, setAuto] = useState({ classIds: [], subjectIds: [], days, timeSlots: defaultSlots.join(", "), clearExisting: true });

  const load = async () => {
    const [classRes, subjectRes, teacherRes, timetableRes] = await Promise.all([
      api.get("/classes"),
      api.get("/subjects"),
      api.get("/auth/users?role=teacher"),
      api.get("/timetable")
    ]);
    setClasses(classRes.data);
    setSubjects(subjectRes.data);
    setTeachers(teacherRes.data);
    setEntries(timetableRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const show = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3500);
  };

  const addClass = async (e) => {
    e.preventDefault();
    try {
      await api.post("/classes", newClass);
      setNewClass({ className: "", semester: "1" });
      show("Class added");
      load();
    } catch (error) {
      show(error.response?.data?.message || "Unable to add class");
    }
  };

  const addTeacher = async (e) => {
    e.preventDefault();
    await api.post("/auth/register", { ...newTeacher, role: "teacher" });
    setNewTeacher({ name: "", email: "", password: "123456" });
    show("Teacher added");
    load();
  };

  const addSubject = async (e) => {
    e.preventDefault();
    await api.post("/subjects", newSubject);
    setNewSubject({ subjectName: "", teacherId: "" });
    show("Subject added");
    load();
  };

  const addEntry = async (e) => {
    e.preventDefault();
    try {
      await api.post("/timetable", entry);
      show("Timetable entry saved");
      load();
    } catch (error) {
      show(error.response?.data?.message || "Clash detected");
    }
  };

  const clearAll = async () => {
    try {
      await api.delete("/timetable/clear-all");
      show("All timetable entries removed");
      load();
    } catch (error) {
      show(error.response?.data?.message || "Unable to clear timetable");
    }
  };

  const generate = async () => {
    try {
      const payload = {
        ...auto,
        timeSlots: auto.timeSlots.split(",").map((item) => item.trim()).filter(Boolean)
      };
      const { data } = await api.post("/timetable/auto-generate", payload);
      show(data.message);
      load();
    } catch (error) {
      show(error.response?.data?.message || "Unable to generate timetable");
    }
  };

  const toggleListValue = (key, value) => {
    setAuto((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value]
    }));
  };

  return (
    <section>
      <div className="page-title">
        <h2>Admin Panel</h2>
        <p>Create teachers, classes, semesters, subjects and your own timetable from scratch</p>
      </div>
      {message && <div className="alert success">{message}</div>}
      <div className="grid two">
        <form className="panel" onSubmit={addClass}>
          <h3>Add Class</h3>
          <input placeholder="BCA" value={newClass.className} onChange={(e) => setNewClass({ ...newClass, className: e.target.value })} required />
          <select value={newClass.semester} onChange={(e) => setNewClass({ ...newClass, semester: e.target.value })}>
            {["1", "2", "3", "4", "5", "6"].map((semester) => <option key={semester} value={semester}>Semester {semester}</option>)}
          </select>
          <button className="primary-button">Save Class</button>
        </form>
        <form className="panel" onSubmit={addTeacher}>
          <h3>Add Teacher</h3>
          <input placeholder="Teacher name" value={newTeacher.name} onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })} required />
          <input type="email" placeholder="Teacher email" value={newTeacher.email} onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={newTeacher.password} onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })} required />
          <button className="primary-button">Save Teacher</button>
        </form>
      </div>
      <div className="grid two">
        <form className="panel" onSubmit={addSubject}>
          <h3>Add Subject</h3>
          <input placeholder="Subject name" value={newSubject.subjectName} onChange={(e) => setNewSubject({ ...newSubject, subjectName: e.target.value })} required />
          <select value={newSubject.teacherId} onChange={(e) => setNewSubject({ ...newSubject, teacherId: e.target.value })} required>
            <option value="">Select teacher</option>
            {teachers.map((teacher) => <option key={teacher._id} value={teacher._id}>{teacher.name}</option>)}
          </select>
          <button className="primary-button">Save Subject</button>
        </form>
        <div className="panel">
          <h3>Timetable Controls</h3>
          <p>Use this when you want a completely fresh timetable.</p>
          <button type="button" className="ghost-button" onClick={clearAll}>Clear All Timetable Entries</button>
        </div>
      </div>
      <form className="panel" onSubmit={addEntry}>
        <h3>Create Timetable Manually</h3>
        <div className="form-row">
          <select value={entry.classId} onChange={(e) => setEntry({ ...entry, classId: e.target.value })} required>
            <option value="">Class</option>
            {classes.map((item) => <option key={item._id} value={item._id}>{classLabel(item)}</option>)}
          </select>
          <select value={entry.subjectId} onChange={(e) => {
            const subject = subjects.find((item) => item._id === e.target.value);
            setEntry({ ...entry, subjectId: e.target.value, teacherId: subject?.teacherId?._id || "" });
          }} required>
            <option value="">Subject</option>
            {subjects.map((item) => <option key={item._id} value={item._id}>{item.subjectName}</option>)}
          </select>
          <select value={entry.day} onChange={(e) => setEntry({ ...entry, day: e.target.value })}>{days.map((item) => <option key={item}>{item}</option>)}</select>
          <input value={entry.timeSlot} onChange={(e) => setEntry({ ...entry, timeSlot: e.target.value })} />
          <button className="primary-button">Add Entry</button>
        </div>
      </form>
      <div className="panel">
        <h3>Auto Timetable Generator</h3>
        <div className="checks">
          {classes.map((item) => <label key={item._id}><input type="checkbox" checked={auto.classIds.includes(item._id)} onChange={() => toggleListValue("classIds", item._id)} /> {classLabel(item)}</label>)}
        </div>
        <div className="checks">
          {subjects.map((item) => <label key={item._id}><input type="checkbox" checked={auto.subjectIds.includes(item._id)} onChange={() => toggleListValue("subjectIds", item._id)} /> {item.subjectName}</label>)}
        </div>
        <input value={auto.timeSlots} onChange={(e) => setAuto({ ...auto, timeSlots: e.target.value })} />
        <label><input type="checkbox" checked={auto.clearExisting} onChange={(e) => setAuto({ ...auto, clearExisting: e.target.checked })} /> Clear existing selected class timetable</label>
        <button type="button" className="primary-button" onClick={generate}>Generate</button>
      </div>
      <div className="table-card">
        <table>
          <thead><tr><th>Class</th><th>Semester</th><th>Subject</th><th>Teacher</th><th>Day</th><th>Time</th></tr></thead>
          <tbody>
            {entries.map((item) => <tr key={item._id}><td>{item.classId?.className}</td><td>{item.classId?.semester}</td><td>{item.subjectId?.subjectName}</td><td>{item.teacherId?.name}</td><td>{item.day}</td><td>{item.timeSlot}</td></tr>)}
            {!entries.length && <tr><td colSpan="6">No timetable entries yet. Add your own schedule from the admin panel.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminPanel;
