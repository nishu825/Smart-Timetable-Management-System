import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const classLabel = (item) => `${item.className} - Semester ${item.semester}`;

const Attendance = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ classId: "", subjectId: "", date: new Date().toISOString().slice(0, 10), timeSlot: "09:00-10:00" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([api.get("/classes"), api.get("/subjects")]).then(([classRes, subjectRes]) => {
      setClasses(classRes.data);
      setSubjects(subjectRes.data.filter((item) => item.teacherId?._id === user.id));
    });
  }, [user.id]);

  useEffect(() => {
    if (form.classId) {
      api.get(`/attendance/students/${form.classId}`).then((res) => {
        setStudents(res.data.map((student) => ({ ...student, status: "Present" })));
      });
    }
  }, [form.classId]);

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      teacherId: user.id,
      students: students.map((student) => ({ studentId: student._id, status: student.status }))
    };
    await api.post("/attendance", payload);
    setMessage("Attendance saved successfully");
  };

  return (
    <section>
      <div className="page-title">
        <h2>Attendance</h2>
        <p>Mark students present or absent</p>
      </div>
      {message && <div className="alert success">{message}</div>}
      <form className="panel" onSubmit={submit}>
        <div className="form-row">
          <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} required>
            <option value="">Select class</option>
            {classes.map((item) => <option key={item._id} value={item._id}>{classLabel(item)}</option>)}
          </select>
          <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} required>
            <option value="">Select subject</option>
            {subjects.map((item) => <option key={item._id} value={item._id}>{item.subjectName}</option>)}
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <input value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} required />
        </div>
        <div className="table-card flat">
          <table>
            <thead><tr><th>Student</th><th>Status</th></tr></thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>
                    <select value={student.status} onChange={(e) => setStudents(students.map((item) => item._id === student._id ? { ...item, status: e.target.value } : item))}>
                      <option>Present</option>
                      <option>Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
              {!students.length && <tr><td colSpan="2">Select a class to load students.</td></tr>}
            </tbody>
          </table>
        </div>
        <button className="primary-button">Save Attendance</button>
      </form>
    </section>
  );
};

export default Attendance;
