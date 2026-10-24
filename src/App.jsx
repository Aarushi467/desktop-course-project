

import { useState } from 'react';
import './App.css';

function App() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadQuestions() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/exam/mcq/1');

      if (!response.ok) {
        throw new Error('Could not load the exam question.');
      }

      const firstQuestion = await response.json();

      // Load all three questions from the Express API.
      const remainingResponses = await Promise.all([
        fetch('http://localhost:3000/exam/mcq/2'),
        fetch('http://localhost:3000/exam/mcq/3'),
      ]);

      if (remainingResponses.some((item) => !item.ok)) {
        throw new Error('Could not load all exam questions.');
      }

      const remainingQuestions = await Promise.all(
        remainingResponses.map((item) => item.json())
      );

      setQuestions([firstQuestion, ...remainingQuestions]);
      setCurrentQuestion(0);
      setAnswers({});
      setSubmitted(false);
      setStarted(true);
    } catch (err) {
      console.error('Question loading failed:', err);
      setError(
        'Unable to load questions. Check that the Express server is running on port 3000.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleStartExam() {
    try {
      const result = await window.desktopAPI.showRulesDialog();

      if (result === 0) {
        await loadQuestions();
      }
    } catch (err) {
      console.error('Could not open examination rules:', err);
      setError('Could not open the examination rules dialog.');
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

  function returnToPortal() {
    setStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setSubmitted(false);
    setError('');
  }

  const question = questions[currentQuestion];

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
            You selected answers for {Object.keys(answers).length} of{' '}
            {questions.length} questions.
          </p>
          <p className="description">
            Your answers have not been scored yet.
          </p>

          <button className="start-button" onClick={returnToPortal}>
            Return to Portal
          </button>
        </section>

        <footer>ATHENA · Desktop Examination System</footer>
      </main>
    );
  }

  if (started && question) {
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
              onClick={() =>
                setCurrentQuestion((previous) => previous - 1)
              }
            >
              ← Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                className="start-button"
                onClick={() =>
                  setCurrentQuestion((previous) => previous + 1)
                }
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
            {Object.keys(answers).length} of {questions.length} questions
            answered
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

        {error && <p className="description">{error}</p>}

        <button
          className="start-button"
          onClick={handleStartExam}
          disabled={loading}
        >
          {loading ? 'Loading Questions...' : 'Start Exam →'}
        </button>
      </section>

      <footer>ATHENA · Desktop Examination System</footer>
    </main>
  );
}

export default App;
