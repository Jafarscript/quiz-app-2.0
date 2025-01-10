/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Assuming you're using React Router
import BackButton from "./BackButton"; // Assuming you have a BackButton component



const questions = [
  {
    id: 1,
    question_text: "What is the capital of France?",
    correct_answer: "Paris",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
  },
  {
    id: 2,
    question_text: "What is 2 + 2?",
    correct_answer: "4",
    options: ["3", "4", "5", "6"],
  },
  {
    id: 3,
    question_text: "Who wrote 'To Kill a Mockingbird'?",
    correct_answer: "Harper Lee",
    options: ["Harper Lee", "J.K. Rowling", "F. Scott Fitzgerald", "Ernest Hemingway"],
  },
  // Add more questions as needed
];

const EachQuestion = () => {
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(30);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const audioRef = useRef(null);
  const { id } = useParams(); // Get the question ID from the URL
  const navigate = useNavigate();

  // Fetch the question based on the id in the URL
  // Fetch the question from localStorage based on the ID
  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
    const selectedQuestion = storedQuestions.find(
      (q) => q.id === parseInt(id || "0")
    );
    setQuestion(selectedQuestion || null);
  }, [id]);

  // Countdown timer logic
  useEffect(() => {
    if (timer > 0 && !isTimerPaused) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timer === 0 && !isTimerPaused) {
      alert("Time's up!");
      navigate("/questions"); // Navigate back to the questions page when time runs out
    }
  }, [timer, isTimerPaused, navigate]);

  // Play sound based on whether the answer is correct
  const playSound = (correct) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(correct ? "/correct.mp3" : "/wrong.mp3");
    audioRef.current.play();
  };

  // Stop sound when the component unmounts or when the sound is stopped
  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    return () => {
      stopSound(); // Stop sound on component unmount
    };
  }, []);

  // Handle answer selection
  const handleAnswerSelection = (option) => {
    if (!isConfirmed) {
      setSelectedOption(option);
    }
  };

  // Confirm the answer and check if it's correct
  const confirmAnswer = () => {
    if (selectedOption) {
      const correct = selectedOption === question?.correct_answer;
      setIsCorrect(correct);
      playSound(correct);
      setIsConfirmed(true);
      setIsTimerPaused(true); // Pause the timer
      setShowModal(false); // Ensure modal doesn't show until explicitly triggered
    }
  };

  // Reset state for the next question
  const resetStateForNextQuestion = () => {
    setIsTimerPaused(false); // Resume timer for next question
    setShowModal(false); // Hide modal
    setIsConfirmed(false); // Allow answering again
    setSelectedOption(null); // Clear selection
  };

  const closeModal = () => {
    setShowModal(false);
    if (isCorrect) {
      navigate(`/surprise`); // Navigate to the surprise page if correct
    } else {
      resetStateForNextQuestion();
    }
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 p-4">
      <BackButton />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">{question.question_text}</h1>
        <p className="text-xl text-gray-700 mb-6">Time Remaining: {timer}s</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {question.options.map((option, index) => {
            let bgColor = "bg-blue-500"; // Default color
            if (isConfirmed) {
              if (option === question.correct_answer) bgColor = "bg-green-500"; // Correct answer
              else if (option === selectedOption) bgColor = "bg-red-500"; // Incorrect answer
            } else if (option === selectedOption) {
              bgColor = "bg-gray-500"; // Selected but not confirmed
            }

            return (
              <button
                key={index}
                className={`px-4 py-2 rounded-md text-white ${bgColor} hover:bg-blue-600`}
                onClick={() => handleAnswerSelection(option)}
                disabled={isConfirmed}
              >
                {option}
              </button>
            );
          })}
        </div>
        {selectedOption && !isConfirmed && (
          <button
            className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
            onClick={confirmAnswer}
          >
            Confirm Answer
          </button>
        )}
        {isConfirmed && !showModal && (
          <button
            className="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600"
            onClick={() => setShowModal(true)}
          >
            Show Result
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">
              {isCorrect ? "Correct Answer!" : "Wrong Answer!"}
            </h2>
            {isCorrect && (
              <p className="mb-4">
                Congratulations! Click the link below to proceed to your surprise.
              </p>
            )}
            {!isCorrect && (
              <p className="mb-4">Better luck next time! Try again with another question.</p>
            )}
            <div className="flex justify-center items-center gap-4">
              {isCorrect && (
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Go to Surprise
                </button>
              )}
              <button
                onClick={() => navigate('/questions')}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EachQuestion;
