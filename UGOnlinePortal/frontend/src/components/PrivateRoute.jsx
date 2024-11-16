// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userType !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
