// import React from "react";
// import { Link } from "react-router-dom";

// const HomePage = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
//       <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg text-center">
//         <h1 className="text-4xl font-bold text-blue-600 mb-4">
//           Welcome to the College Attendance System
//         </h1>
//         <p className="text-gray-700 text-lg mb-8">
//           Manage your attendance, view subjects, and monitor marks efficiently.
//           Choose your role below to continue.
//         </p>

//         <div className="flex justify-center gap-8 mt-8">
//           {/* Student Section */}
//           <div className="w-1/2 bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
//             <h2 className="text-2xl font-semibold text-blue-500"></h2>
//             <p className="text-gray-600 mb-4">
//               Access your profile, view your attendance, and track your
//               performance.
//             </p>
//             <Link
//               to="login"
//               className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
//             >
//               Login
//             </Link>
//             <Link
//               to="/register"
//               className="ml-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-md shadow hover:bg-blue-500 hover:text-white transition"
//             >
//               Register
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import React from "react";
import { Link, Navigate } from "react-router-dom";

const HomePage = () => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  // Redirect logged-in users to their dashboard
  if (token) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Welcome to Your Dashboard
          </h1>

          <div className="flex flex-col items-center gap-4 mt-8">
            <p className="text-xl text-gray-700">
              You are logged in as:{" "}
              <span className="font-semibold capitalize">{userType}</span>
            </p>

            <Link
              to={`/${userType}/dashboard`}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Go to Dashboard
            </Link>

            {userType === "professor" && (
              <Link
                to="/modifyAttendance"
                className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
              >
                Modify Attendance
              </Link>
            )}

            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userType");
                window.location.reload();
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Original landing page for non-logged-in users
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to the College Attendance System
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          Manage your attendance, view subjects, and monitor marks efficiently.
          Choose your role below to continue.
        </p>

        <div className="flex justify-center gap-8 mt-8">
          <div className="w-1/2 bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-blue-500">
              Get Started
            </h2>
            <p className="text-gray-600 mb-4">
              Access your profile, view your attendance, and track your
              performance.
            </p>
            <Link
              to="login"
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="ml-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-md shadow hover:bg-blue-500 hover:text-white transition"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
