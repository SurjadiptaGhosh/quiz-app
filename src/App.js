import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Quiz = () => {
  // State to hold the quiz data, current question, score, and other states
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [answered, setAnswered] = useState(false); // Track if the current question has been answered
  const [selectedOptions, setSelectedOptions] = useState({}); // To store selected options for each question

  // Fetch quiz data from the API
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get("/Uw5CrX");
        console.log("Quiz Data:", response.data);
        setQuestions(response.data.questions); // Store the questions from the response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data", error);
        setLoading(true);
      }
    };
    fetchQuizData();
  }, []);

  // Handle answer selection
  const handleAnswerClick = (option, isCorrect) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1); // Increase score for correct answer
    }
    setAnswered(true); // Mark the question as answered
  };

  // Move to the next question
  const handleNext = () => {
    if (answered) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setAnswered(false); // Reset answered status for the next question
      } else {
        setCompleted(true); // Mark quiz as complete
      }
    }
  };

  // Move to the previous question
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setAnswered(false); // Reset answered status for the previous question
    }
  };

  // Reset the quiz
  const handleTryAgain = () => {
    setCompleted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setAnswered(false); // Reset answered status when retrying
    setSelectedOptions({}); // Reset selected options
  };

  // Loading and error handling
  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (completed) {
    // Data for the pie chart
    const pieChartData = {
      labels: ["Correct Answers", "Incorrect Answers"],
      datasets: [
        {
          data: [score, questions.length - score],
          backgroundColor: ["#36A2EB", "#FF6384"],
          hoverBackgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
    };

    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="w-50 h-50">
          <h2>Quiz Completed!</h2>
          <p>
            Your score: {score} / {questions.length}
          </p>
          {/* Pie Chart */}
          <div style={{ width: "300px", margin: "0 auto" }}>
            <Pie data={pieChartData} />
          </div>
          {/* Try Again Button */}
          <button className="btn btn-success mt-3" onClick={handleTryAgain}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Calculate progress for the progress bar
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="d-flex justify-content-center pt-5 vh-100">
      <div className="w-50">
        {/* Progress Bar */}
        <div className="progress mb-3">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>

        <div className="border-start border-5 border-primary-subtle ps-2">
          <p className="fst-italic fs-5 mb-3">
            Q{currentQuestionIndex + 1}. {currentQuestion.description}
          </p>
        </div>
        {/* Display the question description */}
        <div className="d-flex flex-column">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOptions[currentQuestionIndex] === option;
            const optionClass = isSelected ? "selected-option" : ""; // Add class if option is selected

            return (
              <ol className="list-group mb-2" key={index}>
                <li className="border d-flex align-items-center list-group-item p-0">
                  <span className="px-2">{index + 1}. </span>
                  <button
                    className={`option_btn border-0 bg-white text-start w-100 p-2 ${optionClass}`}
                    onClick={() => handleAnswerClick(option, option.is_correct)} // Check if the option is correct
                  >
                    {option.description} {/* Display the option description */}
                  </button>
                </li>
              </ol>
            );
          })}
        </div>
        {/* Navigation buttons */}
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-secondary px-4 py-1"
            onClick={handleBack}
            disabled={currentQuestionIndex === 0} // Disable if already on the first question
          >
            Back
          </button>
          <button
            className="btn btn-primary px-4 py-1"
            onClick={handleNext}
            disabled={!answered} // Disable if the current question is not answered
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
