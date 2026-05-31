import { useState, useCallback } from 'react';
import './FileUpload.css';

const API_URL = import.meta.env.VITE_API_URL || '';

const STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [message, setMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const validateFile = (selected) => {
    if (!selected) return 'Please select a file.';
    if (selected.type !== 'application/pdf') return 'Only PDF files are allowed.';
    if (selected.size > 10 * 1024 * 1024) return 'File size must be under 10 MB.';
    return null;
  };

  const handleFileSelect = (selected) => {
    const error = validateFile(selected);
    if (error) {
      setFile(null);
      setStatus(STATUS.ERROR);
      setMessage(error);
      return;
    }
    setFile(selected);
    setStatus(STATUS.IDLE);
    setMessage('');
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    handleFileSelect(dropped);
  }, []);

  const handleUpload = async () => {
    const error = validateFile(file);
    if (error) {
      setStatus(STATUS.ERROR);
      setMessage(error);
      return;
    }

    setStatus(STATUS.UPLOADING);
    setMessage('Uploading resume to Azure Blob Storage...');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setStatus(STATUS.SUCCESS);
      setMessage(
        `Resume uploaded successfully! Blob: ${data.blobName}. Processing will begin automatically.`
      );
      setFile(null);
    } catch (err) {
      setStatus(STATUS.ERROR);
      setMessage(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="upload-card">
      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="drop-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="drop-title">
          {file ? file.name : 'Drag & drop your resume here'}
        </p>
        <p className="drop-subtitle">PDF only · Max 10 MB</p>
        <label className="browse-btn">
          Browse Files
          <input
            type="file"
            accept=".pdf,application/pdf"
            hidden
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        </label>
      </div>

      {file && status !== STATUS.UPLOADING && (
        <div className="file-info">
          <span className="file-name">{file.name}</span>
          <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
        </div>
      )}

      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={!file || status === STATUS.UPLOADING}
      >
        {status === STATUS.UPLOADING ? (
          <>
            <span className="spinner" />
            Uploading...
          </>
        ) : (
          'Upload Resume'
        )}
      </button>

      {message && (
        <div className={`status-message status-${status}`} role="alert">
          {status === STATUS.SUCCESS && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
          {status === STATUS.ERROR && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
          {status === STATUS.UPLOADING && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
