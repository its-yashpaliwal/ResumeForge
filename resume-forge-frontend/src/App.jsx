import { useState } from 'react';
import axios from 'axios';

function App() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !jd) {
      setMessage('Please select both files');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jd', jd);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/upload',
        formData
      );
      setMessage(`SUCCESS! Your Job ID: ${response.data.jobId}`);
    } catch (err) {
      setMessage('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ color: '#2563eb' }}>ResumeForge</h1>
      <p>Upload your resume (PDF) + job description → get ATS-friendly version</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            required
            onChange={(e) => setResume(e.target.files[0])}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Job Description (PDF or text)
          </label>
          <input
            type="file"
            accept=".pdf,.txt"
            required
            onChange={(e) => setJd(e.target.files[0])}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 32px',
            fontSize: '18px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Uploading...' : 'Generate Tailored Resume'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: message.includes('SUCCESS') ? '#dcfce7' : '#fee2e2',
          borderRadius: '8px',
          fontSize: '18px',
          color: message.includes('SUCCESS') ? '#166534' : '#991b1b'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default App;