/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-extrabold animate-pulse">
          Welcome to QuizMaster
        </h1>
        <p className="text-lg md:text-2xl font-light max-w-lg mx-auto">
          Challenge yourself with exciting quizzes or manage questions and surprises as an admin!
        </p>
        <div className="flex gap-4 justify-center mt-6">
          <Link
            to="/questions"
            className="px-8 py-3 bg-white text-purple-700 font-semibold text-lg md:text-xl rounded-full shadow-lg hover:bg-purple-100 transition-transform transform hover:scale-105"
          >
            Start Quiz
          </Link>
          <Link
            to="/admin"
            className="px-8 py-3 bg-purple-900 text-white font-semibold text-lg md:text-xl rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
          >
            Admin Panel
          </Link>
        </div>
      </div>
      <div className="absolute bottom-5 text-sm font-light">
        Powered by React & Tailwind CSS
      </div>
    </div>
  );
};

export default LandingPage;
