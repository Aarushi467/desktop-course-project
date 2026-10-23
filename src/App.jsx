
import { useState } from 'react';
import './App.css';

function App() {
  const [started, setStarted] = useState(false);

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
        <h2>{started ? 'Exam Session' : 'Ready to begin?'}</h2>
        <p className="description">
          {started
            ? 'Your exam interface is now active.'
            : 'Review your setup before entering the examination.'}
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
            <strong>{started ? 'In progress' : 'Not started'}</strong>
          </div>
        </div>

        <button
          className="start-button"
          onClick={() => setStarted(true)}
          disabled={started}
        >
          {started ? 'Session Started ✓' : 'Start Exam →'}
        </button>
      </section>

      <footer>ATHENA · Desktop Examination System</footer>
    </main>
  );
}

export default App;
