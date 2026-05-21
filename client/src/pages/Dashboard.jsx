import { BookOpen, GraduationCap, Users } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalClasses: 0, totalTeachers: 0, totalSubjects: 0 });

  useEffect(() => {
    api.get("/dashboard").then((res) => setStats(res.data));
  }, []);

  const cards = [
    { label: "Total Classes", value: stats.totalClasses, icon: GraduationCap },
    { label: "Total Teachers", value: stats.totalTeachers, icon: Users },
    { label: "Total Subjects", value: stats.totalSubjects, icon: BookOpen }
  ];

  return (
    <section>
      <div className="page-title">
        <h2>Dashboard</h2>
        <p>Overview of university timetable data</p>
      </div>
      <div className="stat-grid">
        {cards.map(({ label, value, icon: Icon }) => (
          <article className="stat-card" key={label}>
            <Icon size={28} />
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
