import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { getAllQuizzes, likeQuiz, unlikeQuiz, getLikedQuizzesByUser } from './QuizService';
import { useNavigate } from 'react-router-dom';

const PlayerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [quizzes, setQuizzes] = useState([]);
  const [likedQuizzes, setLikedQuizzes] = useState(new Set()); // ✅ Store liked quizzes for the user
  const navigate = useNavigate();

  const userId = 1; // ✅ Hardcoded userId (replace with actual userId if dynamic)

  useEffect(() => {
    loadQuizzes();
    loadLikedQuizzes();
  }, []);

  // ✅ Load all quizzes from backend
  const loadQuizzes = async () => {
    const data = await getAllQuizzes();
    setQuizzes(data);
  };

  // ✅ Load liked quizzes by the user
  const loadLikedQuizzes = async () => {
    const likedData = await getLikedQuizzesByUser(userId);
    const likedQuizIds = new Set(likedData.map((quiz) => quiz.id));
    setLikedQuizzes(likedQuizIds);
  };

  // ✅ Handle playing the quiz
  const handlePlayQuiz = (quizId) => {
    console.log(`Navigating to /play-quiz/${quizId}`);
    navigate(`/play-quiz/${quizId}`);
  };

  // ✅ Handle liking a quiz
  const handleLikeQuiz = async (quizId) => {
    await likeQuiz(quizId, userId);
    setLikedQuizzes(new Set([...likedQuizzes, quizId])); // Add to liked
  };

  // ✅ Handle unliking a quiz
  const handleUnlikeQuiz = async (quizId) => {
    await unlikeQuiz(quizId, userId);
    const updatedLikes = new Set(likedQuizzes);
    updatedLikes.delete(quizId);
    setLikedQuizzes(updatedLikes);
  };

  return (
    <Container className="mt-4">
      <p className="lead">Welcome back, {user.firstName}!</p>
      <h2>Player Dashboard - Play & Like Quizzes</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Action</th>
            <th>Like/Unlike</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td>{quiz.id}</td>
              <td>{quiz.title}</td>
              <td>{quiz.category}</td>
              <td>{quiz.difficulty}</td>
              <td>
                <Button
                  onClick={() => handlePlayQuiz(quiz.id)}
                  variant="success"
                >
                  Play Quiz
                </Button>
              </td>
              <td>
                {likedQuizzes.has(quiz.id) ? (
                  <Button
                    onClick={() => handleUnlikeQuiz(quiz.id)}
                    variant="danger"
                  >
                    Unlike ❤️
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleLikeQuiz(quiz.id)}
                    variant="outline-primary"
                  >
                    Like 🤍
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PlayerDashboard;
