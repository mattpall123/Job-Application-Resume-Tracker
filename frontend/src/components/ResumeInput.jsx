import { useState, useRef } from 'react';
import axios from 'axios';

export default function ResumeInput({ onChange, resetAfterUpload = false }) {
  const [status, setStatus] = useState('idle');
  const [filename, setFilename] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setStatus('error');
      setErrorMessage('File exceeds 10MB limit.');
      return;
    }

    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setStatus('error');
      setErrorMessage('Only PDF, DOC, and DOCX files are allowed.');
      return;
    }

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/jobs/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setFilename(response.data);
      setStatus('success');
      

      onChange({ hashed: response.data, original: file.name });
      if (inputRef.current) inputRef.current.value = '';

      if (resetAfterUpload) {
        setStatus('idle');
      }
    } catch (error) {
      console.error('Resume upload failed:', error);
      setStatus('error');
      setErrorMessage('Upload failed. Try again.');
    }
  };

  const handleRemove = async () => {
    try {
      await axios.delete(`/api/jobs/resume/${filename}`);
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
    setFilename('');
    setStatus('idle');
    onChange({ hashed: '', original: '' });
  };

  return (
    <>
      <label>Resume</label>
      {status === 'success' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#22c55e', fontSize: '0.85rem' }}>✓ Uploaded</span>
          <button type="button" onClick={handleRemove}
            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
            ✕ Remove
          </button>
        </div>
      ) : (
        <input ref={inputRef} className='field' type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      )}
      {status === 'uploading' && <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Uploading...</p>}
      {status === 'error' && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{errorMessage}</p>}
    </>
  );
}