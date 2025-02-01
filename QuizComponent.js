import React from 'react';

function QuizComponent({ question, onAnswerSelect }) {
  // ✅ Ensure the question object is valid before rendering
  if (!question || !question.question || !question.answers) {
    return <p>Loading question...</p>;
  }

  return (
    <div className="quiz-container">
      <h2>{question.question}</h2>
      <div className="answers">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(answer.isCorrect)}
            className="answer-button"
          >
            {answer.answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizComponent;
