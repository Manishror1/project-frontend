import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizQuestions, submitQuiz } from './QuizService';
import { Container, Button, Form, Alert, ProgressBar } from 'react-bootstrap';

const PlayQuiz = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // ⏱ Per-question timer

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || 1;

  // 🔃 Load questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await getQuizQuestions(quizId);
        if (data.length > 0) {
          setQuestions(data);
        } else {
          setError('No questions available.');
        }
      } catch {
        setError('Error loading questions.');
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [quizId]);

  // ⏱ Timer logic per question
  useEffect(() => {
    if (score !== null || loading) return;

    setTimeLeft(60); // Reset timer for new question
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleTimeout();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on question change
  }, [currentIndex, score, loading]);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers({ ...answers, [questionId]: selectedOption });
  };

  // ⏱ Move to next on timeout or auto-submit
  const handleTimeout = () => {
    if (currentIndex === questions.length - 1) {
      handleSubmit(); // Last question, submit quiz
    } else {
      setCurrentIndex((prev) => prev + 1); // Move to next
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

  const handleSubmit = async () => {
    try {
      const response = await submitQuiz(quizId, userId, answers);
      setScore(response.score);
      setSubmitted(true);
    } catch {
      setError('Error submitting quiz.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const currentQuestion = questions[currentIndex];

  return (
    <Container className="mt-4">
      <h2>Play the Quiz</h2>

      {!submitted && (
        <>
          {/* ⏱ Timer */}
          <ProgressBar now={(timeLeft / 60) * 100} label={`${timeLeft}s`} className="mb-3" />
          <div className="mb-3">⏰ Time left: {timeLeft} seconds</div>
        </>
      )}

      {submitted ? (
        <>
          <Alert variant="success">
            🎉 Your Score: {score}/{questions.length}
          </Alert>
          <h4 className="mt-4">Answer Review:</h4>
          {questions.map((q, index) => (
            <div key={q.id} className="mb-3">
              <strong>{index + 1}. {q.questionText}</strong>
              <div>
                <span style={{ color: 'green' }}>✔ Correct: {q.correctAnswer}</span>
              </div>
              <div>
                <span style={{
                  color: answers[q.id] === q.correctAnswer ? 'green' : 'red'
                }}>
                  Your Answer: {answers[q.id] || 'No answer'}
                </span>
              </div>
              <hr />
            </div>
          ))}
        </>
      ) : (
        <>
          <div key={currentQuestion.id} className="mb-4">
            <h5>
              {currentIndex + 1}. {currentQuestion.questionText}
            </h5>
            <Form>
              {[...(currentQuestion.incorrectAnswers || []), currentQuestion.correctAnswer]
                .sort()
                .map((option, idx) => (
                  <Form.Check
                    key={idx}
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    label={option}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleOptionChange(currentQuestion.id, option)}
                  />
                ))}
            </Form>
          </div>

          <div className="d-flex justify-content-between">
            <Button onClick={handlePrevious} disabled={currentIndex === 0}>
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
      )}
    </Container>
  );
};

export default PlayQuiz;
