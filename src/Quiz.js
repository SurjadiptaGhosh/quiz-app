import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('/Uw5CrX');  // Proxy to API
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz data', error);
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  if (loading && !questions.length) {
    return <div>Loading quiz... Please try again later.</div>;
  }

  if (completed) {
    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p>Your score: {score} / {questions.length}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Error: No questions available.</div>;
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
