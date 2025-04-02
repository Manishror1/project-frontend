import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizQuestions, submitQuiz } from './QuizService';
import { Container, Button, Form, Alert } from 'react-bootstrap';

const PlayQuiz = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0); // 👈 New for pagination
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      setLoading(true);
      try {
        console.log('Fetching questions for quizId:', quizId);
        const data = await getQuizQuestions(quizId);
        console.log('API Response:', data);

        if (isMounted) {
          if (data.length > 0) {
            setQuestions(data);
          } else {
            setQuestions([]);
            setError('No questions available for this quiz.');
          }
        }
      } catch (error) {
        if (isMounted) {
          setError('Error fetching questions. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      isMounted = false;
    };
  }, [quizId]);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers({
      ...answers,
      [questionId]: selectedOption,
    });
  };

  const handleSubmit = async () => {
    try {
      const userId = 1; // Replace with dynamic user ID if available
      const response = await submitQuiz(quizId, userId, answers);
      setScore(response.score);
    } catch (error) {
      setError('Error submitting quiz. Please try again.');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (questions.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error || 'No questions available for this quiz.'}</Alert>
      </Container>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <Container className="mt-4">
      <h2>Play the Quiz</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {score === null ? (
        <>
          <div key={currentQuestion.id} className="mb-4">
            <h5>
              {currentIndex + 1}. {currentQuestion.questionText}
            </h5>
            <Form>
              {[...(currentQuestion.incorrectAnswers || []), currentQuestion.correctAnswer].map(
                (option, idx) => (
                  <Form.Check
                    key={idx}
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    label={option}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleOptionChange(currentQuestion.id, option)}
                  />
                )
              )}
            </Form>
          </div>

          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>

            {currentIndex === questions.length - 1 ? (
              <Button variant="success" onClick={handleSubmit}>
                Submit Quiz
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </>
      ) : (
        <Alert className="mt-4" variant="success">
          🎉 Your Score: {score}/{questions.length}
        </Alert>
      )}
    </Container>
  );
};

export default PlayQuiz;
