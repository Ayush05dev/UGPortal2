import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentAttendanceDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${process.env.BACKEND_URL}/api/student/attendance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setError("Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

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

  return (
    <div className="p-8 max-w-screen-xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">
        Your Attendance
      </h2>
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Classes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attended Classes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceData.map((subject) => (
              <tr key={subject.subjectCode} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {subject.subjectName} ({subject.subjectCode})
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {subject.totalClasses}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {subject.attendedClasses}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {subject.attendancePercentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendanceDashboard;
