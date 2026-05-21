import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const LoginRegister = () => {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", classId: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/classes").then((res) => setClasses(res.data)).catch(() => {});
  }, []);

  if (user) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    try {
      if (mode === "login") await login(form.email, form.password);
      else {
        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        };

        if (form.role === "student" && form.classId) {
          payload.classId = form.classId;
        }

        await register(payload);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Smart Time Table</h1>
        <p>Login as admin, teacher or student</p>
        <div className="switcher">
          <button type="button" className={mode === "login" ? "selected" : ""} onClick={() => setMode("login")}>Login</button>
          <button type="button" className={mode === "register" ? "selected" : ""} onClick={() => setMode("register")}>Register</button>
        </div>
        {mode === "register" && (
          <>
            <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                  classId: e.target.value === "student" ? form.classId : ""
                })
              }
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            {form.role === "student" && (
              <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
                <option value="">Select class</option>
                {classes.map((item) => <option key={item._id} value={item._id}>{item.className}</option>)}
              </select>
            )}
          </>
        )}
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="primary-button">{mode === "login" ? "Login" : "Create Account"}</button>
        {message && <div className="alert">{message}</div>}
      </form>
    </div>
  );
};

export default LoginRegister;
