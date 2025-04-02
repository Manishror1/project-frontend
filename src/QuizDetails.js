import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizById, getQuizQuestions } from './QuizService';
import { Container, ListGroup, Button } from 'react-bootstrap';

const QuizDetails = () => {
  const { quizId } = useParams(); // ✅ Get quizId from URL
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadQuizDetails();
  }, [quizId]);

  // ✅ Load quiz and questions
  const loadQuizDetails = async () => {
    try {
      const quizData = await getQuizById(quizId);
      setQuiz(quizData);

      const questionData = await getQuizQuestions(quizId);
      setQuestions(questionData);
    } catch (error) {
      console.error('Error loading quiz details:', error);
    }
  };

  return (
    <Container className="mt-4">
      {quiz ? (
        <>
          <h2>{quiz.title}</h2>
          <p><strong>Category:</strong> {quiz.category}</p>
          <p><strong>Difficulty:</strong> {quiz.difficulty}</p>

          <h4 className="mt-4">Questions:</h4>
          <ListGroup>
            {questions.map((question, index) => (
              <ListGroup.Item key={question.id}>
                {index + 1}. {question.questionText}
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Button variant="primary" className="mt-3" onClick={() => alert('Quiz Started!')}>
            Start Quiz
          </Button>
        </>
      ) : (
        <p>Loading quiz details...</p>
      )}
    </Container>
  );
};

export default QuizDetails;
