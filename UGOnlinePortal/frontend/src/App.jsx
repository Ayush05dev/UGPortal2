import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Landing from "./pages/Landing";
import StudentAttendance from "./pages/StudentAttendancePage";
import ProfessorAttendanceDashboard from "./pages/ProfessorAttendanceDashboard";
import ProfessorAllAttendance from "./pages/ProfessorAllAttendance";
// import Landing from "./pages/Landing";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute allowedRole="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/professor/dashboard"
          element={
            <PrivateRoute allowedRole="professor">
              <ProfessorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/modifyAttendance"
          element={
            <PrivateRoute allowedRole="professor">
              <ProfessorAllAttendance />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
