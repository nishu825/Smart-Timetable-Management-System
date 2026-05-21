import { BookOpen, CalendarDays, ClipboardList, LayoutDashboard, LogOut, Settings, UserCheck } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user, logout } = useAuth();

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/timetable", label: "Timetable", icon: CalendarDays },
    { to: "/attendance", label: "Attendance", icon: ClipboardList, roles: ["teacher"] },
    { to: "/report", label: "Report", icon: BookOpen, roles: ["admin", "teacher"] },
    { to: "/admin", label: "Admin Panel", icon: Settings, roles: ["admin"] },
    { to: "/substitution", label: "Substitution", icon: UserCheck, roles: ["admin"] }
  ].filter((link) => !link.roles || link.roles.includes(user?.role));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h1>Smart Timetable</h1>
          <p>{user?.name} • {user?.role}</p>
        </div>
        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active nav-item" : "nav-item")}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="ghost-button" onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
