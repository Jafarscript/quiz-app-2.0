import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SurprisePage = () => {
  const navigate = useNavigate();
  const [surprise, setSurprise] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Load surprises from localStorage or use a default fallback
  const storedSurprises = JSON.parse(localStorage.getItem("surprises")) || [
    { id: 1, surprise_text: "You won a free coffee!", surprise_value: 5 },
    { id: 2, surprise_text: "You earned a gift card!", surprise_value: 10 },
    { id: 3, surprise_text: "You got a movie ticket!", surprise_value: 15 },
    { id: 4, surprise_text: "Congratulations! You won a free book!", surprise_value: 20 },
  ];

  const openSurprise = () => {
    // Randomly pick a surprise from the stored surprises
    const randomSurprise =
      storedSurprises[Math.floor(Math.random() * storedSurprises.length)];
    setSurprise(randomSurprise);
    setIsOpen(true);
  };

  const goBack = () => {
    navigate("/questions");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Surprise Page</h1>

      <p className="text-xl text-gray-700 mb-6">
        You&apos;ve answered correctly! Here&apos;s your surprise.
      </p>

      {!isOpen && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-transform duration-300 hover:scale-105"
          onClick={openSurprise}
        >
          Open Surprise
        </button>
      )}

      {isOpen && surprise && (
        <div className="mt-4 p-4 bg-white rounded-md shadow-md text-center">
          <p className="text-lg font-bold mb-2">{surprise.surprise_text}</p>
          <p className="text-sm text-gray-500">Value: ${surprise.surprise_value}</p>
        </div>
      )}

      {isOpen && !surprise && (
        <div className="mt-4 p-4 bg-white rounded-md shadow-md text-center">
          <p className="text-lg">No surprises available right now. Please try again later.</p>
        </div>
      )}

      <button
        className="mt-6 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-transform duration-300 hover:scale-105"
        onClick={goBack}
      >
        Back to Questions
      </button>
    </div>
  );
};

export default SurprisePage;
