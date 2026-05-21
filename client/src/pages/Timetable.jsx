import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const classLabel = (item) => `${item.className} - Semester ${item.semester}`;

const Timetable = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(user?.classId || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const load = async () => {
    const params = {};
    if (user.role === "teacher") params.teacherId = user.id;
    if (user.role === "student") params.classId = user.classId;
    if (user.role === "admin" && classId) params.classId = classId;
    if (date) params.date = date;
    const { data } = await api.get("/timetable", { params });
    setEntries(data);
  };

  useEffect(() => {
    api.get("/classes").then((res) => setClasses(res.data));
  }, []);

  useEffect(() => {
    load();
  }, [classId, date]);

  const timeSlots = useMemo(() => {
    return [...new Set(entries.map((entry) => entry.timeSlot))].sort();
  }, [entries]);

  const grid = useMemo(() => {
    return timeSlots.map((timeSlot) => ({
      timeSlot,
      cells: days.map((day) => {
        const dayEntries = entries.filter((entry) => entry.day === day && entry.timeSlot === timeSlot);
        return { day, entries: dayEntries };
      })
    }));
  }, [entries, timeSlots]);

  return (
    <section>
      <div className="page-title">
        <h2>Weekly Timetable</h2>
        <p>Teacher and student schedules are shown in a full week table</p>
      </div>
      <div className="toolbar">
        {user.role === "admin" && (
          <select value={classId} onChange={(e) => setClassId(e.target.value)}>
            <option value="">All classes</option>
            {classes.map((item) => <option key={item._id} value={item._id}>{classLabel(item)}</option>)}
          </select>
        )}
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              {days.map((day) => <th key={day}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {grid.map((row) => (
              <tr key={row.timeSlot}>
                <td>{row.timeSlot}</td>
                {row.cells.map((cell) => (
                  <td key={`${row.timeSlot}-${cell.day}`}>
                    {cell.entries.length ? cell.entries.map((entry) => (
                      <div key={entry._id}>
                        <strong>{entry.subjectId?.subjectName}</strong><br />
                        <span>{entry.classId?.className} - Sem {entry.classId?.semester}</span><br />
                        <span>{entry.displayTeacher?.name || entry.teacherId?.name}</span>
                        {entry.isSubstituted && <span className="badge">Substitute</span>}
                      </div>
                    )) : <span>Free</span>}
                  </td>
                ))}
              </tr>
            ))}
            {!grid.length && <tr><td colSpan="7">No timetable entries found.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Timetable;
