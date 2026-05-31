import FileUpload from './components/FileUpload';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-badge">Azure Functions Demo</div>
        <h1>Smart Resume Processing System</h1>
        <p className="header-subtitle">
          Upload a PDF resume to Azure Blob Storage. An Azure Function automatically
          extracts metadata and stores it for processing.
        </p>
      </header>

      <main className="main">
        <FileUpload />
      </main>

      <section className="architecture-preview">
        <h2>How It Works</h2>
        <div className="flow-steps">
          <div className="flow-step">
            <span className="step-num">1</span>
            <span className="step-label">Upload PDF</span>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <span className="step-num">2</span>
            <span className="step-label">Blob Storage</span>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <span className="step-num">3</span>
            <span className="step-label">Function Trigger</span>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <span className="step-num">4</span>
            <span className="step-label">Metadata JSON</span>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Event-Driven Architecture · Serverless · Application Insights</p>
      </footer>
    </div>
  );
}
