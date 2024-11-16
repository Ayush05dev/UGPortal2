// StudentSubjectEnrollment.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
// import {BACKEND_URL} from "../../../.env"
const StudentSubjectEnrollment = () => {
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [currentSubjects, setCurrentSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.BACKEND_URL}/api/student/available-subjects`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAvailableSubjects(response.data.availableSubjects);
      setCurrentSubjects(response.data.currentSubjects);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch subjects");
      setLoading(false);
    }
  };

  const handleSubjectSelect = (subjectId) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((id) => id !== subjectId);
      }
      return [...prev, subjectId];
    });
  };

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.BACKEND_URL}/api/student/enroll`,
        { subjectIds: selectedSubjects },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh subjects list after enrollment
      fetchSubjects();
      setSelectedSubjects([]);
    } catch (error) {
      setError("Failed to enroll in subjects");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">
        Subject Enrollment
      </h2>

      {/* Current Subjects */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Current Subjects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentSubjects.map((subject) => (
            <div
              key={subject._id}
              className="p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <h4 className="font-semibold">{subject.name}</h4>
              <p className="text-sm text-gray-600">{subject.code}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Available Subjects */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Available Subjects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSubjects.map((subject) => (
            <div
              key={subject._id}
              className={`p-4 rounded-lg border cursor-pointer ${
                selectedSubjects.includes(subject._id)
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-gray-200 hover:border-indigo-300"
              }`}
              onClick={() => handleSubjectSelect(subject._id)}
            >
              <h4 className="font-semibold">{subject.name}</h4>
              <p className="text-sm text-gray-600">{subject.code}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedSubjects.length > 0 && (
        <button
          onClick={handleEnroll}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Enroll in Selected Subjects
        </button>
      )}
    </div>
  );
};

export default StudentSubjectEnrollment;
