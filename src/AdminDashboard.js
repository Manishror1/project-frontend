import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Row,
  Col
} from 'react-bootstrap';
import {
  getAllQuizzes,
  createQuiz,
  deleteQuiz,
  updateQuiz
} from './QuizService';
import axios from 'axios';

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
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
    likes: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadQuizzes();
    loadUsers();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await getAllQuizzes();
      setQuizzes(data);
    } catch {
      setError('Failed to fetch quizzes.');
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/users/all');
      setUsers(res.data);
    } catch {
      setError('Failed to fetch users.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizForm({ ...quizForm, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (quizForm.id) {
        await updateQuiz(quizForm.id, quizForm);
        setSuccess('Quiz updated successfully!');
      } else {
        await createQuiz(quizForm);
        setSuccess('Quiz created successfully!');
      }
      loadQuizzes();
      handleCloseModal();
    } catch {
      setError('Error saving quiz.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this quiz?')) {
      await deleteQuiz(id);
      setSuccess('Quiz deleted.');
      loadQuizzes();
    }
  };

  const handleShowModal = (quiz = null) => {
    setQuizForm(
      quiz
        ? {
            ...quiz,
            createdDate: quiz.createdDate || '',
            startDate: quiz.startDate || '',
            endDate: quiz.endDate || ''
          }
        : {
            id: null,
            title: '',
            category: '',
            difficulty: 'Easy',
            description: '',
            createdDate: new Date().toISOString().split('T')[0],
            startDate: '',
            endDate: '',
            active: true,
            likes: 0
          }
    );
    setShowModal(true);
  };

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
      likes: 0
    });
    setError('');
    setSuccess('');
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const user = users.find((u) => u.id === userId);
      const updatedUser = {
        ...user,
        role: newRole
      };
      await axios.put(`http://localhost:8080/api/users/${userId}`, updatedUser);
      setSuccess(`Role updated for user ${user.username}`);
      loadUsers();
    } catch {
      setError('Failed to update role.');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Admin Dashboard - Manage Quizzes</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Button className="mb-3" onClick={() => handleShowModal()}>
        Add New Quiz
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Created</th>
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
                <Button variant="info" onClick={() => handleShowModal(quiz)} className="me-2">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(quiz.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{quizForm.id ? 'Edit Quiz' : 'Create Quiz'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group><Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={quizForm.title} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mt-2"><Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={quizForm.category} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mt-2"><Form.Label>Difficulty</Form.Label>
              <Form.Select name="difficulty" value={quizForm.difficulty} onChange={handleChange}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-2"><Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={quizForm.description} onChange={handleChange} />
            </Form.Group>
            <Row className="mt-2">
              <Col>
                <Form.Label>Start</Form.Label>
                <Form.Control type="date" name="startDate" value={quizForm.startDate} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>End</Form.Label>
                <Form.Control type="date" name="endDate" value={quizForm.endDate} onChange={handleChange} />
              </Col>
            </Row>
            <Button className="mt-3" variant="primary" onClick={handleSave}>Save</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <hr className="my-4" />
      <h4>Manage Users</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Current Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.role}</td>
              <td>
                <Form.Select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  style={{ maxWidth: '150px' }}
                >
                  <option value="PLAYER">PLAYER</option>
                  <option value="ADMIN">ADMIN</option>
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDashboard;