import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Quiz = () => {
  // State to hold the quiz data, current question, and score
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  // Fetch quiz data from the API
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('https://api.jsonserve.com/Uw5CrX');
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz data', error);
        setLoading(false);
      }
    };
    fetchQuizData();
  }, []);

  // Function to handle answer selection
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1); // Increase score for correct answer
    }

    // Move to the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCompleted(true); // Mark the quiz as complete
    }
  };

  // Loading and error handling
  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (completed) {
    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p>Your score: {score} / {questions.length}</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2>{currentQuestion.question}</h2>
      <div>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(option.isCorrect)}
          >
            {option.answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
