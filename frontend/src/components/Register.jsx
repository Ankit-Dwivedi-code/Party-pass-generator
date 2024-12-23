// src/components/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [session, setSession] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic field validation
    if (!name || !email || !session || !rollNo || !code || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // Send signup request to backend
      const response = await fetch(`http://localhost:5001/api/v1/students/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, session, rollNo, code, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error(data.message || "Failed to register");
      }
    } catch (error) {
      toast.error("An error occurred while registering. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-green-400">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl text-center text-gray-800 font-bold mb-8">Student Registration</h2>
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 font-semibold">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-semibold">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Session */}
          <div className="flex flex-col">
            <label htmlFor="session" className="mb-2 font-semibold">Session</label>
            <input
              type="text"
              id="session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Roll Number */}
          <div className="flex flex-col">
            <label htmlFor="rollNo" className="mb-2 font-semibold">Roll Number</label>
            <input
              type="text"
              id="rollNo"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Signup Code */}
          <div className="flex flex-col">
            <label htmlFor="code" className="mb-2 font-semibold">Signup Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 font-semibold">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="mb-2 font-semibold">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
