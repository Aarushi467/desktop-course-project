

import { useState } from 'react';
import './App.css';

const questions = [
  {
    id: 1,
    question: 'Which part of Electron manages the application lifecycle and native operating system APIs?',
    options: [
      'React component',
      'Main process',
      'CSS stylesheet',
      'HTML document',
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: 'Which technology is used to build the user interface in this project?',
    options: ['React', 'SQLite', 'Git', 'npm'],
    correctAnswer: 0,
  },
  {
    id: 3,
    question: 'What is the purpose of a preload script in Electron?',
    options: [
      'To style buttons',
      'To replace React',
      'To expose selected APIs safely between processes',
      'To install npm packages',
    ],
    correctAnswer: 2,
  },
];

function App() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  async function handleStartExam() {
    try {
      const result = await window.desktopAPI.showRulesDialog();

      if (result === 0) {
        setStarted(true);
      }
    } catch (error) {
      console.error('Could not open examination rules:', error);
    }
  }

  function selectAnswer(optionIndex) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion]: optionIndex,
    }));
  }

  function finishExam() {
    setSubmitted(true);
  }

  const question = questions[currentQuestion];

  const score = questions.reduce((total, item, index) => {
    return total + (answers[index] === item.correctAnswer ? 1 : 0);
  }, 0);

  if (submitted) {
    return (
      <main className="exam-app">
        <header className="exam-header">
          <div>
            <p className="eyebrow">ATHENA · ASSESSMENT PLATFORM</p>
            <h1>Examination Result</h1>
          </div>
          <span className="status">● Submitted</span>
        </header>

        <section className="exam-card">
          <p className="eyebrow">ASSESSMENT COMPLETE</p>
          <h2>Your exam is submitted!</h2>
          <p className="description">
            You answered {Object.keys(answers).length} of {questions.length} questions.
          </p>

          <div className="exam-details">
            <div>
              <span>Score</span>
              <strong>{score} / {questions.length}</strong>
            </div>
            <div>
              <span>Percentage</span>
              <strong>{Math.round((score / questions.length) * 100)}%</strong>
            </div>
          </div>

          <button
            className="start-button"
            onClick={() => {
              setStarted(false);
              setCurrentQuestion(0);
              setAnswers({});
              setSubmitted(false);
            }}
          >
            Return to Portal
          </button>
        </section>

        <footer>ATHENA · Desktop Examination System</footer>
      </main>
    );
  }

  if (started) {
    return (
      <main className="exam-app">
        <header className="exam-header">
          <div>
            <p className="eyebrow">ATHENA · ASSESSMENT PLATFORM</p>
            <h1>MCQ Examination</h1>
          </div>
          <span className="status">● In Progress</span>
        </header>

        <section className="exam-card question-card">
          <p className="eyebrow">
            QUESTION {currentQuestion + 1} OF {questions.length}
          </p>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <h2>{question.question}</h2>

          <div className="answer-options">
            {question.options.map((option, index) => (
              <button
                key={option}
                className={`answer-option ${
                  answers[currentQuestion] === index ? 'selected' : ''
                }`}
                onClick={() => selectAnswer(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {option}
              </button>
            ))}
          </div>

          <div className="question-navigation">
            <button
              className="secondary-button"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((previous) => previous - 1)}
            >
              ← Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                className="start-button"
                onClick={() => setCurrentQuestion((previous) => previous + 1)}
              >
                Next Question →
              </button>
            ) : (
              <button className="start-button" onClick={finishExam}>
                Submit Exam ✓
              </button>
            )}
          </div>

          <p className="description">
            {Object.keys(answers).length} of {questions.length} questions answered
          </p>
        </section>

        <footer>ATHENA · Desktop Examination System</footer>
      </main>
    );
  }

  return (
    <main className="exam-app">
      <header className="exam-header">
        <div>
          <p className="eyebrow">ATHENA · ASSESSMENT PLATFORM</p>
          <h1>Examination Portal</h1>
        </div>
        <span className="status">● System Ready</span>
      </header>

      <section className="exam-card">
        <p className="eyebrow">IN-CLASS ASSESSMENT</p>
        <h2>Ready to begin?</h2>
        <p className="description">
          Review your setup before entering the examination.
        </p>

        <div className="exam-details">
          <div>
            <span>Assessment</span>
            <strong>MCQ Examination</strong>
          </div>
          <div>
            <span>Mode</span>
            <strong>Desktop Application</strong>
          </div>
          <div>
            <span>Session</span>
            <strong>Not started</strong>
          </div>
        </div>

        <button className="start-button" onClick={handleStartExam}>
          Start Exam →
        </button>
      </section>

      <footer>ATHENA · Desktop Examination System</footer>
    </main>
  );
}

export default App;
