import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const [surprises, setSurprises] = useState(JSON.parse(localStorage.getItem("surprises")) || []);
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem("questions"))|| []);
  const [newSurprise, setNewSurprise] = useState({ text: "", value: 0 });
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    correct_answer: "",
    options: [""],
  });
  const [activeTab, setActiveTab] = useState("questions");
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
    const savedSurprises = JSON.parse(localStorage.getItem("surprises")) || [];
    setQuestions(savedQuestions);
    setSurprises(savedSurprises);
  }, []);

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
    localStorage.setItem("surprises", JSON.stringify(surprises));
  }, [questions, surprises]);

  const addSurprise = () => {
    if (!newSurprise.text || newSurprise.value <= 0) {
      alert("Please enter a valid surprise text and value.");
      return;
    }
    const newEntry = {
      id: surprises.length ? surprises[surprises.length - 1].id + 1 : 1,
      surprise_text: newSurprise.text,
      surprise_value: newSurprise.value,
    };
    setSurprises([...surprises, newEntry]);
    setNewSurprise({ text: "", value: 0 });
  };

  const addQuestion = () => {
    if (
      !newQuestion.text.trim() ||
      !newQuestion.correct_answer ||
      newQuestion.options.length < 2
    ) {
      alert("Please enter a valid question, options, and correct answer.");
      return;
    }
    const newEntry = {
      id: questions.length ? questions[questions.length - 1].id + 1 : 1,
      question_text: newQuestion.text.trim(),
      correct_answer: newQuestion.correct_answer,
      options: newQuestion.options,
    };
    setQuestions([...questions, newEntry]);
    setNewQuestion({ text: "", correct_answer: "", options: [""] });
  };


  // Handle option input
  const handleOptionChange = (e, index) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = e.target.value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  // Add a new option
  const addOption = () => {
    setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ""] });
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (activeTab === "questions") {
      setQuestions(questions.map((q) => (q.id === editItem.id ? editItem : q)));
    } else {
      setSurprises(surprises.map((s) => (s.id === editItem.id ? editItem : s)));
    }
    setShowEditModal(false);
    setEditItem(null);
  };

  const toggleTab = (tab) => setActiveTab(tab);

  return (
    <section className="bg-gradient-to-br from-gray-100 to-blue-200 min-h-screen p-6">
      <Link
        to="/"
        className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Home
      </Link>
      <div className="flex flex-col items-center mt-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Admin Page</h1>

        <div className="flex space-x-4 mb-6">
          <button
            className={`px-6 py-2 rounded-md shadow-md ${
              activeTab === "questions"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
            onClick={() => toggleTab("questions")}
          >
            Questions
          </button>
          <button
            className={`px-6 py-2 rounded-md shadow-md ${
              activeTab === "surprises"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
            onClick={() => toggleTab("surprises")}
          >
            Surprises
          </button>
        </div>

        {activeTab === "questions" && (
          <div className="w-full max-w-lg transition-all">
            <h2 className="text-2xl font-semibold mb-4">Manage Questions</h2>
            <input
              type="text"
              placeholder="Enter a new question"
              value={newQuestion.text}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, text: e.target.value })
              }
              className="border p-2 w-full rounded-md mb-2"
            />
            <input
              type="text"
              placeholder="Enter correct answer"
              value={newQuestion.correct_answer}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  correct_answer: e.target.value,
                })
              }
              className="border p-2 w-full rounded-md mb-2"
            />
            <div className="mb-2">
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(e, index)}
                    className="border p-2 w-full rounded-md mb-2"
                  />
                </div>
              ))}
              <button
                onClick={addOption}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Add Option
              </button>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => addQuestion()}
            >
              Add Question
            </button>
            {questions.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between bg-white p-4 rounded-md shadow-md mt-4"
              >
                <div>
                  <p className="font-bold">{q.question_text}</p>
                  <p className="text-sm text-gray-500">
                    Correct Answer: {q.correct_answer}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                    onClick={() => handleEdit(q)}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "surprises" && (
          <div className="w-full max-w-lg transition-all">
            <h2 className="text-2xl font-semibold mb-4">Manage Surprises</h2>
            <input
              type="text"
              placeholder="Surprise Text"
              value={newSurprise.text}
              onChange={(e) =>
                setNewSurprise({ ...newSurprise, text: e.target.value })
              }
              className="border p-2 w-full rounded-md mb-2"
            />
            <input
              type="number"
              placeholder="Surprise Value"
              value={newSurprise.value}
              onChange={(e) =>
                setNewSurprise({
                  ...newSurprise,
                  value: Number(e.target.value),
                })
              }
              className="border p-2 w-full rounded-md mb-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => addSurprise()}
            >
              Add Surprise
            </button>
            {surprises.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between bg-white p-4 rounded-md shadow-md mt-4"
              >
                <div>
                  <p className="font-bold">{s.surprise_text}</p>
                  <p className="text-sm text-gray-500">
                    Value: ${s.surprise_value}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                    onClick={() => handleEdit(s)}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                Edit {activeTab === "questions" ? "Question" : "Surprise"}
              </h2>
              {activeTab === "questions" ? (
                <>
                  <input
                    type="text"
                    value={editItem.question_text}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        question_text: e.target.value,
                      })
                    }
                    className="border p-2 w-full rounded-md mb-2"
                    placeholder="Edit Question"
                  />
                  <h3>Correct Answer:</h3>
                  <input
                    type="text"
                    value={editItem.correct_answer}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        correct_answer: e.target.value,
                      })
                    }
                    className="border p-2 w-full rounded-md mb-2"
                    placeholder="Edit Correct Answer"
                  />
                  <div className="mb-4">
                    {editItem.options.map((option, index) => (
                      <div key={index} className="flex flex-col items-center mb-2 gap-3">
                        <h3 className="self-start">Option {index + 1}</h3>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const updatedOptions = [...editItem.options];
                            updatedOptions[index] = e.target.value;
                            setEditItem({
                              ...editItem,
                              options: updatedOptions,
                            });
                          }}
                          className="border p-2 w-full rounded-md"
                          placeholder={`Edit Option ${index + 1}`}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setEditItem({
                          ...editItem,
                          options: [...editItem.options, ""],
                        })
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Add Option
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={editItem.surprise_text}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        surprise_text: e.target.value,
                      })
                    }
                    className="border p-2 w-full rounded-md mb-2"
                    placeholder="Edit Surprise Text"
                  />
                  <input
                    type="number"
                    value={editItem.surprise_value}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        surprise_value: Number(e.target.value),
                      })
                    }
                    className="border p-2 w-full rounded-md mb-2"
                    placeholder="Edit Surprise Value"
                  />
                </>
              )}
              <div className="flex justify-end gap-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={saveEdit}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminPage;
