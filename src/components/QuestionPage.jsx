/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const QuestionsPage = () => {
  // State for questions and visited questions
  const [questions, setQuestions] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState([]);

  // Load questions from localStorage
  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
    setQuestions(storedQuestions);
  }, []);

  // Load visited questions from localStorage (if available)
  useEffect(() => {
    const storedVisited =
      JSON.parse(localStorage.getItem("visitedQuestions")) || [];
    setVisitedQuestions(storedVisited);
  }, []);

  // Update visited questions when a question is clicked
  const handleQuestionClick = (questionId) => {
    setVisitedQuestions((prevVisited) => {
      const updatedVisited = [...prevVisited, questionId];
      // Store updated visited questions in localStorage
      localStorage.setItem("visitedQuestions", JSON.stringify(updatedVisited));
      return updatedVisited;
    });
  };

  // Helper function to check if a question is visited
  const isVisited = (questionId) => visitedQuestions.includes(questionId);

  // Reset visited questions
  const resetVisitedQuestions = () => {
    setVisitedQuestions([]); // Clear the state
    localStorage.removeItem("visitedQuestions"); // Remove from localStorage
  };

  // Play intro sound when the page loads
  useEffect(() => {
    const audio = new Audio("/intro.mp3"); // Ensure 'intro.mp3' is in the public folder
    audio.play();

    return () => {
      // Cleanup to stop the sound if the component unmounts
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 flex flex-col items-center">
      <Link
        to="/"
        className="text-blue-600 bg-white text-base self-start hover:bg-blue-600 hover:text-white border-blue-600 px-5 py-1 border rounded-md font-medium"
      >
        Home
      </Link>
      <h1 className="text-4xl font-bold text-white text-center mt-4 mb-10 drop-shadow-lg">
        Select a Question
      </h1>

      {questions.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {questions.map((question, index) => {
            const questionId = question.id || index + 1; // Use question ID or fallback
            return (
              <Link
                key={questionId}
                to={`/question/${questionId}`}
                className={`bg-white rounded-lg shadow-lg p-6 flex items-center justify-center hover:scale-105 transform transition-all duration-300 hover:shadow-xl ${
                  isVisited(questionId) ? "bg-slate-700 cursor-not-allowed" : ""
                }`}
                onClick={() => handleQuestionClick(questionId)}
              >
                <span className="text-xl lg:text-2xl font-semibold text-gray-800">
                  {questionId}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl font-semibold text-white mb-6">
            No questions available yet.
          </p>
          <Link
            to="/admin"
            className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-600 hover:text-white transition-all duration-300"
          >
            Add Questions
          </Link>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={resetVisitedQuestions}
        className="mt-6 bg-red-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
      >
        Reset Visited Questions
      </button>
    </div>
  );
};

export default QuestionsPage;
