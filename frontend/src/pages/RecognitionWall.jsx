import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

const RecognitionWall = () => {
  const [recognitions, setRecognitions] = useState([]);

  useEffect(() => {
    fetchRecognitions();
  }, []);

  const fetchRecognitions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/recognitions`);
      setRecognitions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">Peer Recognition Wall</h1>
      </header>
      
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {recognitions.map((rec) => (
          <div key={rec.id} className="card glass-card fade-in" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.1 }}>🏆</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginRight: '1rem', fontWeight: 'bold' }}>
                {rec.toName.charAt(0)}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{rec.toName}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Recognized by {rec.fromName}</p>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', color: 'var(--text-main)', lineHeight: '1.6' }}>"{rec.message}"</p>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>+{rec.points} Points</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(rec.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
      
      {recognitions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <span style={{ fontSize: '3rem' }}>🌟</span>
          <h3>No recognitions yet.</h3>
          <p className="text-muted">Be the first to recognize a colleague from your dashboard!</p>
        </div>
      )}
    </div>
  );
};

export default RecognitionWall;
