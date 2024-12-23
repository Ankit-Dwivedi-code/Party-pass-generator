// src/components/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState(""); // Added state for password
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Send login request to backend
    const response = await fetch("http://localhost:5002/api/v1/students/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, rollNo, password }), // Sending email, rollNo, and password
    });

    const data = await response.json();
    console.log(data);  // Log data to understand its structure

    if (data.statusCode === 200 && data.data && data.data._id && data.data.token) {
      // Successfully logged in, store the token and redirect to the party pass page
      localStorage.setItem("authToken", data.data.token);  // Save token to localStorage
      toast.success("Login successful!");
      
      // Redirect to party pass page using the studentId
      navigate(`/student/party-pass/${data.data._id}`);
    } else {
      // Display error message
      toast.error(data.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 to-yellow-400">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-4xl text-center text-gray-800 font-bold mb-8">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email input */}
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

          {/* Roll Number input */}
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

          {/* Password input */}
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

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
