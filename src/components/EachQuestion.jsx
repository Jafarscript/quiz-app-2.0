/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "./BackButton";

const EachQuestion = () => {
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(30);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const audioRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
    const selectedQuestion = storedQuestions.find(
      (q) => q.id === parseInt(id || "0")
    );
    setQuestion(selectedQuestion || null);
  }, [id]);

  useEffect(() => {
    if (timer > 0 && !isTimerPaused) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timer === 0 && !isTimerPaused) {
      alert("Time's up!");
      navigate("/questions");
    }
  }, [timer, isTimerPaused, navigate]);

  const playSound = (correct) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(correct ? "/correct.mp3" : "/wrong.mp3");
    audioRef.current.play();
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  const handleAnswerSelection = (option) => {
    if (!isConfirmed) {
      setSelectedOption(option);
    }
  };

  const confirmAnswer = () => {
    if (selectedOption) {
      const correct = selectedOption === question?.correct_answer;
      setIsCorrect(correct);
      playSound(correct);
      setIsConfirmed(true);
      setIsTimerPaused(true);
      if (correct) {
        setShowModal(true); // Show modal immediately for correct answers
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (isCorrect) {
      navigate(`/surprise`);
    } else {
      resetStateForNextQuestion();
    }
  };

  const resetStateForNextQuestion = () => {
    setIsTimerPaused(false);
    setShowModal(false);
    setIsConfirmed(false);
    setSelectedOption(null);
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
            let bgColor = "bg-blue-500";
            if (isConfirmed) {
              if (option === question.correct_answer) bgColor = "bg-green-500";
              else if (option === selectedOption) bgColor = "bg-red-500";
            } else if (option === selectedOption) {
              bgColor = "bg-gray-500";
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Correct Answer!</h2>
            <p className="mb-4">
              Congratulations! Click the link below to proceed to your surprise.
            </p>
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Go to Surprise
              </button>
              <button
                onClick={() => setShowModal(false)} // Close modal without navigation
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
