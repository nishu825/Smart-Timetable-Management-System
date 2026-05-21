import { useEffect, useState } from "react";
import api from "../api/axios";

const Substitution = () => {
  const [entries, setEntries] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [form, setForm] = useState({ timetableId: "", substituteTeacherId: "", date: new Date().toISOString().slice(0, 10) });
  const [message, setMessage] = useState("");

  const load = async () => {
    const [timeRes, teacherRes, subRes] = await Promise.all([
      api.get("/timetable"),
      api.get("/auth/users?role=teacher"),
      api.get("/substitution")
    ]);
    setEntries(timeRes.data);
    setTeachers(teacherRes.data);
    setSubs(subRes.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    const item = entries.find((entry) => entry._id === form.timetableId);
    if (!item) return;
    await api.post("/substitution", {
      date: form.date,
      classId: item.classId._id,
      subjectId: item.subjectId._id,
      originalTeacherId: item.teacherId._id,
      substituteTeacherId: form.substituteTeacherId,
      timeSlot: item.timeSlot
    });
    setMessage("Substitute teacher assigned");
    load();
  };

  return (
    <section>
      <div className="page-title">
        <h2>Teacher Substitution</h2>
        <p>Assign substitute teacher for an absent teacher</p>
      </div>
      {message && <div className="alert success">{message}</div>}
      <form className="panel" onSubmit={submit}>
        <div className="form-row">
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <select value={form.timetableId} onChange={(e) => setForm({ ...form, timetableId: e.target.value })} required>
            <option value="">Select lecture</option>
            {entries.map((item) => (
              <option key={item._id} value={item._id}>
                {item.classId?.className} - {item.subjectId?.subjectName} - {item.teacherId?.name} - {item.timeSlot}
              </option>
            ))}
          </select>
          <select value={form.substituteTeacherId} onChange={(e) => setForm({ ...form, substituteTeacherId: e.target.value })} required>
            <option value="">Substitute teacher</option>
            {teachers.map((teacher) => <option key={teacher._id} value={teacher._id}>{teacher.name}</option>)}
          </select>
          <button className="primary-button">Assign</button>
        </div>
      </form>
      <div className="table-card">
        <table>
          <thead><tr><th>Date</th><th>Class</th><th>Subject</th><th>Original</th><th>Substitute</th><th>Time</th></tr></thead>
          <tbody>
            {subs.map((item) => (
              <tr key={item._id}>
                <td>{item.date}</td>
                <td>{item.classId?.className}</td>
                <td>{item.subjectId?.subjectName}</td>
                <td>{item.originalTeacherId?.name}</td>
                <td>{item.substituteTeacherId?.name}</td>
                <td>{item.timeSlot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Substitution;
