import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCcw, Play } from 'lucide-react';
import './Quiz.css';
import app from './firebase';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import Leaderboard from './leaderboard.jsx'; // Make sure filename case matches your file

const questions = [
  {
    questionText: 'How many vertices does a cube have?',
    options: [
      { answerText: '6', isCorrect: false },
      { answerText: '8', isCorrect: true },
      { answerText: '10', isCorrect: false },
      { answerText: '12', isCorrect: false },
    ],
  },
  {
    questionText: 'What is the formula for which the area of a scalene triangle can be found?',
    options: [
      { answerText: 'Herons Formula', isCorrect: true },
      { answerText: 'Pyhtagoras Theorem', isCorrect: false },
      { answerText: '1/2*Base*Height', isCorrect: false },
      { answerText: 'Mean Value Theorem', isCorrect: false },
    ],
  },
  {
    questionText: 'What is the largest stock exchange sector in India',
    options: [
      { answerText: 'Bombay Stock Exchange', isCorrect: true },
      { answerText: 'Chennai Stock Exchange', isCorrect: false },
      { answerText: 'Calcutta Stock Exchange', isCorrect: false },
      { answerText: 'Other', isCorrect: false },
    ],
  },
];

export default function App() {
  const db = getFirestore(app);

  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'score'
  const [userName, setUserName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // --- AUTOMATIC UPLOAD TO 'scores' COLLECTION ---
  useEffect(() => {
    if (gameState === 'score') {
      const uploadScore = async () => {
        try {
          // Changed collection name to "scores" to match your Leaderboard
          await addDoc(collection(db, "scores"), {
            name: userName,
            score: score,
            // Added timestamp so Leaderboard doesn't crash on .toDate()
            createdAt: new Date() 
          });
          console.log("Score uploaded to 'scores' collection!");
        } catch (error) {
          console.error("Error uploading score: ", error);
        }
      };
      
      uploadScore();
    }
  }, [gameState]); // Only runs when gameState switches to 'score'

  const handleStart = () => {
    if (userName.trim()) {
      setGameState('playing');
    }
  };

  const handleAnswerOptionClick = (isCorrect, index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    // Calculate score immediately to ensure correct value is uploaded
    let currentScore = score;
    if (isCorrect) {
      currentScore = score + 1;
      setScore(currentScore);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
      } else {
        setGameState('score');
      }
    }, 1000);
  };

  const handleReset = () => {
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setGameState('menu');
    setUserName('');
  };

  return (
    <div className="quiz-container">
      {/* 1. MENU SCREEN */}
      {gameState === 'menu' && (
        <div className="menu-section">
          <h2>Welcome to React Quiz</h2>
          <p>Enter your name to start</p>
          <input 
            type="text" 
            placeholder="Your Name" 
            className="name-input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button 
            onClick={handleStart} 
            className="start-btn"
            disabled={!userName.trim()} 
          >
            <Play size={16} style={{marginRight: '8px'}}/> Start Quiz
          </button>
        </div>
      )}

      {/* 2. QUIZ SCREEN */}
      {gameState === 'playing' && (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="question-text">
              {questions[currentQuestion].questionText}
            </div>
          </div>
          <div className="answer-section">
            {questions[currentQuestion].options.map((option, index) => {
              let buttonClass = "answer-button";
              if (selectedAnswer !== null) {
                if (index === selectedAnswer) {
                   buttonClass += option.isCorrect ? " correct" : " incorrect";
                }
              }
              return (
                <button 
                  key={index} 
                  className={buttonClass}
                  onClick={() => handleAnswerOptionClick(option.isCorrect, index)}
                  disabled={selectedAnswer !== null}
                >
                  {option.answerText}
                  {selectedAnswer === index && option.isCorrect && <CheckCircle size={20} />}
                  {selectedAnswer === index && !option.isCorrect && <XCircle size={20} />}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* 3. SCORE SCREEN */}
      {gameState === 'score' && (
        <div className="score-section">
          <h2>Well done, {userName}!</h2>
          <p>You scored {score} out of {questions.length}</p>
          <button onClick={handleReset} className="reset-btn">
            <RefreshCcw size={16} style={{marginRight: '8px'}}/> Restart
          </button>
          
          <Leaderboard/>
        </div>
      )}
    </div>
  );
}