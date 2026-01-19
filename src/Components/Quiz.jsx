import { useState, useEffect } from "react";
import questions from "./questions";
import "./Quiz.css";

const TIME_PER_QUESTION = 30; // seconds

const Quiz = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedOption, setSelectedOption] = useState(null);

  // Timer logic
  useEffect(() => {
    if (!isStarted || showResult) return;

    if (timeLeft === 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isStarted, showResult]);

  const startQuiz = () => {
    setIsStarted(true);
    setCurrent(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(TIME_PER_QUESTION);
    setSelectedOption(null);
  };

  const handleAnswer = (index) => {
    setSelectedOption(index);

    if (index === questions[current].answer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(handleNext, 800);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setTimeLeft(TIME_PER_QUESTION);

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setIsStarted(false);
    setCurrent(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(TIME_PER_QUESTION);
    setSelectedOption(null);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-card">

        {!isStarted ? (
          <>
            <h2>Welcome to the Quiz 🧠</h2>
            <p>Total Questions: {questions.length}</p>
            <p>Time per Question: {TIME_PER_QUESTION}s</p>
            <button onClick={startQuiz}>Start Quiz</button>
          </>
        ) : showResult ? (
          <>
            <h2>Quiz Completed 🎉</h2>
            <p>Your Score: {score} / {questions.length}</p>
            <button onClick={restartQuiz}>Restart Quiz</button>
          </>
        ) : (
          <>
            <div className="top-bar">
              <span>
                Q {current + 1}/{questions.length}
              </span>
              <span className={`timer ${timeLeft <= 10 ? "danger" : ""}`}>
                ⏱ {timeLeft}s
              </span>
            </div>

            <h2>{questions[current].question}</h2>

            <div className="options">
              {questions[current].options.map((option, index) => {
                let className = "";

                if (selectedOption !== null) {
                  if (index === questions[current].answer) {
                    className = "correct";
                  } else if (index === selectedOption) {
                    className = "wrong";
                  }
                }

                return (
                  <button
                    key={index}
                    className={className}
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswer(index)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Quiz;
