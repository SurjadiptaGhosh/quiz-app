import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuizComponent from './QuizComponent';
import ResultComponent from './ResultComponent';

function App() {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Fetch quiz data from API
  useEffect(() => {
    axios.get('/Uw5CrX')
  .then(response => setQuizData(response.data))
  .catch(error => console.error('Error fetching quiz data:', error));

  }, []);

  // Handle answer selection
  const handleAnswerSelect = (isCorrect) => {
    // ✅ Use functional updates to prevent stale state issues
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  
    // ✅ Use functional updates for `currentQuestionIndex`
    setCurrentQuestionIndex(prevIndex => {
      if (quizData && quizData.questions && prevIndex < quizData.questions.length - 1) {
        return prevIndex + 1;
      } else {
        setIsQuizComplete(true);
        return prevIndex; // Keep it unchanged
      }
    });
  };
  

  if (isQuizComplete) {
    return <ResultComponent score={score} totalQuestions={quizData.questions.length} />;
  }

  return (
    <div className="App">
      {quizData && quizData.questions && quizData.questions.length > 0 ? (
        <QuizComponent
          question={quizData.questions[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
        />
      ) : (
        <p>Loading quiz or no data available...</p>
      )}
    </div>
  );
  
  
}

export default App;
