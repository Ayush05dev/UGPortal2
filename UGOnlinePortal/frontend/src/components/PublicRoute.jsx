// components/PublicRoute.jsx
import { Navigate } from "react-router-dom";

// components/PublicRoute.jsx
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  if (token && window.location.pathname !== "/") {
    return <Navigate to={`/${userType}/dashboard`} replace />;
  }

  return children;
};
export default PublicRoute;
