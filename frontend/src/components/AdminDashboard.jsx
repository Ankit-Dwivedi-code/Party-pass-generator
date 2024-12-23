import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [signupCode, setSignupCode] = useState(null);
  const [validationCode, setValidationCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCodeValid, setIsCodeValid] = useState(null);
  const [isCodeUsed, setIsCodeUsed] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5001/api/v1/admin";

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/me`, { withCredentials: true });
        setAdmin(response.data.data);
      } catch (err) {
        setError("Failed to fetch admin details.");
        navigate("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminDetails();
  }, [navigate]);

  const handleGenerateCode = async () => {
    setError("");
    setSuccessMessage("");
    if (!studentEmail || !/\S+@\S+\.\S+/.test(studentEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/code/generate`,
        { email: studentEmail },
        { withCredentials: true }
      );
      setSignupCode(response.data.data.code);
      setSuccessMessage("Signup code generated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate signup code.");
    }
  };

  const handleValidateCode = async () => {
    setError("");
    setSuccessMessage("");
    if (!validationCode || !studentEmail) {
      setError("Please enter both email and signup code.");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/code/validate`,
        { email: studentEmail, code: validationCode },
        { withCredentials: true }
      );
      setIsCodeValid(response.data.data.valid);
      if (response.data.data.valid) {
        setSuccessMessage("The signup code is valid.");
      } else {
        setError("The signup code is invalid or already used.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to validate signup code.");
    }
  };

  const handleMarkCodeUsed = async () => {
    setError("");
    setSuccessMessage("");
    if (!validationCode || !studentEmail) {
      setError("Please enter both email and signup code.");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/code/use`,
        { email: studentEmail, code: validationCode },
        { withCredentials: true }
      );
      setIsCodeUsed(true);
      setSuccessMessage("The signup code has been marked as used.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark signup code as used.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      navigate("/admin/login");
    } catch (err) {
      setError("Failed to log out.");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading admin details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div>
            <span className="mr-4">Welcome, {admin.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        {/* Notifications */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Generate Signup Code */}
        <section className="bg-white p-6 shadow-md rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Generate Signup Code</h2>
          <div className="mb-4">
            <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-600">
              Student Email
            </label>
            <input
              type="email"
              id="studentEmail"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="Enter student email"
            />
          </div>
          <button
            onClick={handleGenerateCode}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Generate Signup Code
          </button>
          {signupCode && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 border border-green-300 rounded-lg">
              Generated Signup Code: <span className="font-bold">{signupCode}</span>
            </div>
          )}
        </section>

        {/* Validate Signup Code */}
        <section className="bg-white p-6 shadow-md rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Validate Signup Code</h2>
          <div className="mb-4">
            <label htmlFor="validationCode" className="block text-sm font-medium text-gray-600">
              Signup Code
            </label>
            <input
              type="text"
              id="validationCode"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
              value={validationCode}
              onChange={(e) => setValidationCode(e.target.value)}
              placeholder="Enter signup code"
            />
          </div>
          <button
            onClick={handleValidateCode}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Validate Code
          </button>
          {isCodeValid !== null && (
            <div className={`mt-4 p-3 ${isCodeValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} border border-${isCodeValid ? "green" : "red"}-300 rounded-lg`}>
              {isCodeValid ? "The signup code is valid." : "The signup code is invalid or already used."}
            </div>
          )}
        </section>

        {/* Mark Code as Used */}
        <section className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Mark Signup Code as Used</h2>
          <button
            onClick={handleMarkCodeUsed}
            className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Mark Code as Used
          </button>
          {isCodeUsed && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg">
              The signup code has been marked as used.
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
