// ProfessorDashboard.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfessorAttendanceDashboard from "./ProfessorAttendanceDashboard";

function ProfessorDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/login"); // Redirect to login
  };
  const EmptyState = () => (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900">
        No Subjects Assigned
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Please contact the administrator to assign subjects to your account.
      </p>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Professor Dashboard
              </h1>
            </div>

            {/* Desktop Navigation
            <div className="hidden sm:flex sm:items-center">
              <Link
                to="/modifyAttendance"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Modify Previous Attendance
              </Link>
            </div> */}
            <div className="hidden sm:flex sm:items-center space-x-4">
              <Link
                to="/modifyAttendance"
                className="text-gray-600 hover:text-indigo-600"
              >
                Modify Previous Attendance
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/modifyAttendance"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
              >
                Modify Previous Attendance
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              <ProfessorAttendanceDashboard EmptyState={EmptyState} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfessorDashboard;
