import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import {
  getAllQuizzes,
  createQuiz,
  deleteQuiz,
  updateQuiz,
} from './QuizService';

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [quizForm, setQuizForm] = useState({
    id: null,
    title: '',
    category: '',
    difficulty: 'Easy',
    description: '',
    createdDate: '',
    startDate: '',
    endDate: '',
    active: true,
    likes: 0,
    
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ Load quizzes when the component mounts
  useEffect(() => {
    loadQuizzes();
  }, []);

  // ✅ Fetch all quizzes
  const loadQuizzes = async () => {
  try {
    const data = await getAllQuizzes();  // Correct API call
    setQuizzes(data);                    // Save quizzes to state
  } catch (error) {
    setError('Failed to fetch quizzes. Please try again.');
  }
};

  // ✅ Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizForm({ ...quizForm, [name]: value });
  };

  // ✅ Handle form submit to create or update quiz
  const handleSave = async () => {
    try {
      if (quizForm.id) {
        // ✅ If quizForm.id exists -> Update Quiz
        console.log('Updating quiz with ID:', quizForm.id);
        await updateQuiz(quizForm.id, quizForm);
        setSuccess('Quiz updated successfully!');
      } else {
        // ✅ If no id -> Create New Quiz
        console.log('Creating new quiz...');
        await createQuiz(quizForm);
        setSuccess('Quiz created successfully!');
      }
  
      loadQuizzes(); // Reload quizzes after save
      handleCloseModal();
    } catch (error) {
      console.error('Error saving quiz:', error);
      setError('Error saving quiz. Please try again.');
    }
  };


  // ✅ Handle delete quiz
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(id);
        setSuccess('Quiz deleted successfully!');
        loadQuizzes();
      } catch (error) {
        setError('Error deleting quiz. Please try again.');
      }
    }
  };

  // ✅ Open modal for creating or updating
  const handleShowModal = (quiz = null) => {
    if (quiz) {
      // ✅ Edit existing quiz
      setQuizForm({
        id: quiz.id,
        title: quiz.title,
        category: quiz.category,
        difficulty: quiz.difficulty,
        description: quiz.description,
        createdDate: quiz.createdDate || '', // ✅ Correct property
        startDate: quiz.startDate || '', // ✅ Correct property
        endDate: quiz.endDate || '', // ✅ Correct property
        active: quiz.active,
        likes: quiz.likes || 0,
      });
    } else {
      // ✅ Create new quiz
      setQuizForm({
        id: null,
        title: '',
        category: '',
        difficulty: 'Easy',
        description: '',
        createdDate: new Date().toISOString().split('T')[0],
        startDate: '',
        endDate: '',
        active: true,
        likes: 0,
      });
    }
    setShowModal(true);
  };
  // ✅ Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setQuizForm({
      id: null,
      title: '',
      category: '',
      difficulty: 'Easy',
      description: '',
      createdDate: new Date().toISOString().split('T')[0],
      startDate: '',
      endDate: '',
      active: true,
      likes: 0,
    });
    setError('');
    setSuccess('');
  };

  return (
    <Container className="mt-4">
      <h2>Admin Dashboard - Manage Quizzes</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* ✅ Button to create a new quiz */}
      <Button className="mb-3" onClick={() => handleShowModal()}>
        Add New Quiz
      </Button>

      {/* ✅ Quizzes Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
          <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Created Date</th>
            <th>Likes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.id}>
             <td>{quiz.id}</td>
              <td>{quiz.title}</td>
              <td>{quiz.category}</td>
              <td>{quiz.difficulty}</td>
              <td>{quiz.startDate}</td>
              <td>{quiz.endDate}</td>
              <td>{quiz.createdDate}</td>
              <td>{quiz.likes}</td>
              <td>
                <Button
                  variant="info"
                  className="me-2"
                  onClick={() => handleShowModal(quiz)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(quiz.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ✅ Modal for Add/Edit Quiz */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{quizForm.id ? 'Edit Quiz' : 'Create Quiz'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={quizForm.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={quizForm.category}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Difficulty</Form.Label>
              <Form.Control
                as="select"
                name="difficulty"
                value={quizForm.difficulty}
                onChange={handleChange}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={quizForm.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Created Date</Form.Label>
              <Form.Control
                type="date"
                name="createdDate"
                value={quizForm.createdDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={quizForm.startDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={quizForm.endDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button className="mt-3" variant="primary" onClick={handleSave}>
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
