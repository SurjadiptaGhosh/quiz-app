import React from 'react';

function ResultComponent({ score, totalQuestions }) {
  return (
    <div className="result-container">
      <h2>Quiz Complete!</h2>
      <p>Your Score: {score} out of {totalQuestions}</p>
      <p>{score / totalQuestions >= 0.7 ? 'Great job!' : 'Better luck next time!'}</p>
    </div>
  );
}

export default ResultComponent;
