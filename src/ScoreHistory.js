import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaHistory } from 'react-icons/fa';

const ScoreHistory = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchScoreHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/score/user/${user.id}/history`
      );
      setScores(response.data);
    } catch (err) {
      console.error('Error fetching score history:', err);
      setError('Unable to load your score history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScoreHistory();
  }, []);

  return (
    <Container
      className="mt-5 p-4 rounded"
      style={{
        background: 'linear-gradient(to right, #e0f7fa, #ffffff)',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
      }}
    >
      <h2 className="text-center mb-4" style={{ color: '#00796b', fontWeight: 'bold' }}>
        <FaHistory className="me-2" />
        My Score History 📘
      </h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="grow" variant="info" />
          <p className="mt-2 text-muted">Loading your history...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : scores.length === 0 ? (
        <p className="text-muted text-center">No quizzes attempted yet.</p>
      ) : (
        <Table
          bordered
          hover
          responsive
          className="text-center"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead style={{ backgroundColor: '#009688', color: '#fff' }}>
            <tr>
              <th>#</th>
              <th>Quiz Title</th>
              <th>Score</th>
              <th>Completed On</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr
                key={score.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f1f8f9' : '#ffffff',
                }}
              >
                <td>
                  <Badge bg="secondary">{index + 1}</Badge>
                </td>
                <td style={{ color: '#00796b', fontWeight: 600 }}>
                  {score.quiz?.title || 'N/A'}
                </td>
                <td style={{ fontWeight: 600 }}>{score.score}</td>
                <td>{score.completedDate}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ScoreHistory;
