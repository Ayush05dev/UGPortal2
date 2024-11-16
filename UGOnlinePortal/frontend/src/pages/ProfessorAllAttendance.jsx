import React, { useState, useEffect } from "react";
import axios from "axios";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-6">
          <h3 className="text-xl text-red-600">Something went wrong</h3>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProfessorAllAttendance = () => {
  const [profile, setProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [profileRes, dashboardRes] = await Promise.all([
          axios.get(`${process.env.BACKEND_URL}/api/professor/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.BACKEND_URL}/api/professor/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProfile(profileRes.data);
        setSubjects(dashboardRes.data.subjects || []);
      } catch (error) {
        console.error("Error fetching professor data:", error);
        setError("Failed to load professor data");
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorData();
  }, []);

  const handleSubjectSelect = async () => {
    try {
      if (selectedSubject && selectedSection && selectedBranch) {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${process.env.BACKEND_URL}/api/professor/all-attendance`,
          {
            params: {
              subject: selectedSubject,
              section: selectedSection,
              branch: selectedBranch,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAttendanceRecords(response.data);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      if (error.response?.status === 404) {
        setError(
          `No students found in ${selectedSection} section of ${selectedBranch} branch for this subject`
        );
      } else {
        setError("Failed to fetch attendance data");
      }
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (recordId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${process.env.BACKEND_URL}/api/professor/modify-attendance`,
        {
          recordId,
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setAttendanceRecords((prevRecords) =>
          prevRecords.map((record) =>
            record._id === recordId ? { ...record, status: newStatus } : record
          )
        );
      }
    } catch (error) {
      console.error("Error modifying attendance:", error);
      alert(
        `Failed to modify attendance: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          No Subjects Available
        </h3>
        <p className="text-gray-600">
          You need to have subjects assigned to modify attendance. Please
          contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-screen-xl mx-auto space-y-8">
      {profile && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">
            Welcome, {profile.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold">Your Subjects:</h3>
              <ul className="list-disc list-inside">
                {subjects.map((subject) => (
                  <li key={subject._id}>
                    {subject.name} ({subject.code})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Your Sections:</h3>
              <ul className="list-disc list-inside">
                {profile.sections?.map((section) => (
                  <li key={section}>{section}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Your Branches:</h3>
              <ul className="list-disc list-inside">
                {profile.branches?.map((branch) => (
                  <li key={branch}>{branch}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Modify Attendance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            className="w-full p-2 border rounded-lg"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name} ({subject.code})
              </option>
            ))}
          </select>

          <select
            className="w-full p-2 border rounded-lg"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="">Select Section</option>
            {profile?.sections?.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>

          <select
            className="w-full p-2 border rounded-lg"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            {profile?.branches?.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubjectSelect}
          disabled={!selectedSubject || !selectedSection || !selectedBranch}
          className={`w-full md:w-auto px-6 py-2 rounded-lg ${
            !selectedSubject || !selectedSection || !selectedBranch
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white`}
        >
          View Attendance
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>

      {attendanceRecords.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Modify Attendance Records
          </h3>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === "Present"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      onClick={() =>
                        handleAttendanceChange(record._id, "Present")
                      }
                      className={`px-3 py-1 rounded-lg text-white ${
                        record.status === "Present"
                          ? "bg-gray-400"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() =>
                        handleAttendanceChange(record._id, "Absent")
                      }
                      className={`px-3 py-1 rounded-lg text-white ${
                        record.status === "Absent"
                          ? "bg-gray-400"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Absent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default function ProfessorAllAttendanceWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <ProfessorAllAttendance />
    </ErrorBoundary>
  );
}
