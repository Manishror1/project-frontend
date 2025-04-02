import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Badge } from 'react-bootstrap';
import {
  getAllQuizzes,
  likeQuiz,
  unlikeQuiz,
  getLikedQuizzesByUser
} from './QuizService';
import { useNavigate } from 'react-router-dom';

const PlayerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [quizzes, setQuizzes] = useState([]);
  const [likedQuizzes, setLikedQuizzes] = useState(new Set());
  const navigate = useNavigate();
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      loadQuizzes();
      loadLikedQuizzes();
    }
  }, [userId]);

  const loadQuizzes = async () => {
    const data = await getAllQuizzes();
    setQuizzes(data);
  };

  const loadLikedQuizzes = async () => {
    const likedData = await getLikedQuizzesByUser(userId);
    const likedQuizIds = new Set(likedData.map((quiz) => quiz.id));
    setLikedQuizzes(likedQuizIds);
  };

  const handlePlayQuiz = (quizId) => {
    navigate(`/play-quiz/${quizId}`);
  };

  const handleLikeQuiz = async (quizId) => {
    await likeQuiz(quizId, userId);
    setLikedQuizzes((prev) => new Set(prev).add(quizId));
  };

  const handleUnlikeQuiz = async (quizId) => {
    await unlikeQuiz(quizId, userId);
    setLikedQuizzes((prev) => {
      const updated = new Set(prev);
      updated.delete(quizId);
      return updated;
    });
  };

  return (
    <Container className="mt-4">
      <p className="lead">Welcome back, {user?.firstName}!</p>
      <h2>Player Dashboard - Play & Like Quizzes</h2>
      <Table striped bordered hover responsive className="text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title & Availability</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Play</th>
            <th>Like</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => {
            const now = new Date();
            const start = new Date(quiz.startDate);
            const end = new Date(quiz.endDate);
            const isAvailable = now >= start && now <= end;

            return (
              <tr key={quiz.id}>
                <td>{quiz.id}</td>
                <td>
                  <strong>{quiz.title}</strong>
                  <br />
                  <Badge bg={isAvailable ? 'success' : 'secondary'} className="mt-1">
                    {isAvailable ? 'Available Now' : 'Unavailable'}
                  </Badge>
                  <br />
                  <small>
                    {quiz.startDate} ➜ {quiz.endDate}
                  </small>
                </td>
                <td>{quiz.category}</td>
                <td>{quiz.difficulty}</td>
                <td>
                  <Button
                    variant={isAvailable ? 'success' : 'secondary'}
                    onClick={() => handlePlayQuiz(quiz.id)}
                    disabled={!isAvailable}
                  >
                    {isAvailable ? 'Play Quiz' : 'Not Available'}
                  </Button>
                </td>
                <td>
                  {likedQuizzes.has(quiz.id) ? (
                    <Button variant="danger" onClick={() => handleUnlikeQuiz(quiz.id)}>
                      Unlike ❤️
                    </Button>
                  ) : (
                    <Button variant="outline-primary" onClick={() => handleLikeQuiz(quiz.id)}>
                      Like 🤍
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default PlayerDashboard;
