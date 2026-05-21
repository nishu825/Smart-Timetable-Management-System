import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import LoginRegister from "./pages/LoginRegister";
import Report from "./pages/Report";
import Substitution from "./pages/Substitution";
import Timetable from "./pages/Timetable";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginRegister />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="attendance" element={<ProtectedRoute roles={["teacher"]}><Attendance /></ProtectedRoute>} />
        <Route path="report" element={<ProtectedRoute roles={["admin", "teacher"]}><Report /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute roles={["admin"]}><AdminPanel /></ProtectedRoute>} />
        <Route path="substitution" element={<ProtectedRoute roles={["admin"]}><Substitution /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
