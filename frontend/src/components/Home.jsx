// src/pages/Home.jsx
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="   h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 text-white">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg mb-6">
          Welcome to the <br /> Fresher & Farewell Party 🎉
        </h1>
        <p className="text-lg md:text-xl font-medium mb-8">
          Join the fun, generate your pass, and be part of the celebration!
        </p>

        {/* Buttons */}
        <div className="space-y-4">
          <Link
            to="/register"
            className="bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-bold px-8 py-3 rounded-lg text-lg shadow-md transform hover:scale-105 transition-transform"
          >
            Get Your Party Pass
          </Link>

          <div className="mt-4">
            <Link
              to="/admin/signup"
              className="text-sm underline hover:text-yellow-200"
            >
              Admin Signup/Login
            </Link>
          </div>
        </div>
      </div>

      {/* Fancy Decorations */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-pink-400 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400 rounded-full blur-3xl opacity-50 transform translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute bottom-10 w-32 h-32 bg-yellow-300 rounded-full blur-2xl opacity-50 transform translate-x-1/4"></div>
    </div>
  );
};

export default Home;
