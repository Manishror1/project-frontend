import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaMedal } from 'react-icons/fa';

const ScoreBoard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/score/leaderboard');
        setScores(response.data);
      } catch (err) {
        setError('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedal = (rank) => {
    const medals = ['#ffd700', '#c0c0c0', '#cd7f32']; // Gold, Silver, Bronze
    return (
      <FaMedal style={{ color: medals[rank], fontSize: '1.2rem' }} />
    );
  };

  return (
    <Container
      className="mt-5 p-4 rounded"
      style={{
        background: 'linear-gradient(to right, #f3f9ff, #ffffff)',
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
      }}
    >
      <h2 className="mb-4 text-center" style={{ fontWeight: '700', color: '#005792' }}>
        🏆 Global Leaderboard
      </h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading leaderboard...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : scores.length === 0 ? (
        <p className="text-muted text-center">No scores to display yet.</p>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className="text-center rounded"
          style={{ backgroundColor: '#fff' }}
        >
          <thead style={{ backgroundColor: '#005792', color: '#fff' }}>
            <tr>
              <th style={{ width: '90px' }}>Rank</th>
              <th>User ID</th>
              <th>Quiz ID</th>
              <th>Quiz Title</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr
                key={score.id}
                style={{
                  transition: 'all 0.2s',
                  backgroundColor: index % 2 === 0 ? '#f5faff' : 'white',
                }}
              >
                <td>
                  {index < 3 ? getMedal(index) : <Badge bg="secondary">#{index + 1}</Badge>}
                </td>
                <td>
                  <strong>{score.userId}</strong>
                </td>
                <td>{score.quizId}</td>
                <td style={{ color: '#0077b6', fontWeight: '500', fontStyle: 'italic' }}>
                  {score.quiz?.title || 'N/A'}
                </td>
                <td style={{ color: '#2e8b57', fontWeight: '600' }}>{score.score}</td>
                <td>{score.completedDate}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ScoreBoard;
