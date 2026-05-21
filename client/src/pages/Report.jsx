import { useEffect, useState } from "react";
import api from "../api/axios";

const classLabel = (item) => `${item.className} - Semester ${item.semester}`;

const Report = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filter, setFilter] = useState({ classId: "", subjectId: "", date: "" });
  const [report, setReport] = useState({ totalStudents: 0, present: 0, absent: 0, attendancePercentage: 0, recordsCount: 0 });

  useEffect(() => {
    Promise.all([api.get("/classes"), api.get("/subjects")]).then(([classRes, subjectRes]) => {
      setClasses(classRes.data);
      setSubjects(subjectRes.data);
    });
  }, []);

  const load = async () => {
    const params = Object.fromEntries(Object.entries(filter).filter(([, value]) => value));
    const { data } = await api.get("/attendance/report", { params });
    setReport(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <div className="page-title">
        <h2>Attendance Report</h2>
        <p>Summary of present, absent and percentage</p>
      </div>
      <div className="toolbar">
        <select value={filter.classId} onChange={(e) => setFilter({ ...filter, classId: e.target.value })}>
          <option value="">All classes</option>
          {classes.map((item) => <option key={item._id} value={item._id}>{classLabel(item)}</option>)}
        </select>
        <select value={filter.subjectId} onChange={(e) => setFilter({ ...filter, subjectId: e.target.value })}>
          <option value="">All subjects</option>
          {subjects.map((item) => <option key={item._id} value={item._id}>{item.subjectName}</option>)}
        </select>
        <input type="date" value={filter.date} onChange={(e) => setFilter({ ...filter, date: e.target.value })} />
        <button className="primary-button" onClick={load}>Generate</button>
      </div>
      <div className="stat-grid">
        <article className="stat-card"><span>Total Marked</span><strong>{report.totalStudents}</strong></article>
        <article className="stat-card"><span>Present</span><strong>{report.present}</strong></article>
        <article className="stat-card"><span>Absent</span><strong>{report.absent}</strong></article>
        <article className="stat-card"><span>Percentage</span><strong>{report.attendancePercentage}%</strong></article>
      </div>
    </section>
  );
};

export default Report;
