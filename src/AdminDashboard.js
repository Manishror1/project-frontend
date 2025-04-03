import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
  Badge
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
  const [theme, setTheme] = useState('light');
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

  const darkStyle = theme === 'dark' ? {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    transition: 'background 0.5s ease'
  } : {};

  return (
    <Container style={{ marginTop: '30px', animation: 'fadeIn 0.7s ease-in-out', ...darkStyle }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ color: theme === 'dark' ? '#ffffff' : '#2c3e50' }}>Admin Dashboard - Manage Quizzes</h2>
        <ToggleButtonGroup type="radio" name="theme" value={theme} onChange={val => setTheme(val)}>
          <ToggleButton id="t1" variant="outline-dark" value={'light'}>☀️ Light</ToggleButton>
          <ToggleButton id="t2" variant="outline-light" value={'dark'}>🌙 Dark</ToggleButton>
        </ToggleButtonGroup>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Button
        style={{ backgroundColor: '#5c6bc0', border: 'none', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
        onClick={() => handleShowModal()}
      >
        ➕ Add New Quiz
      </Button>

      <Table bordered hover responsive style={{ backgroundColor: theme === 'dark' ? '#2c3e50' : '#ffffff', borderRadius: '10px', overflow: 'hidden', color: theme === 'dark' ? '#ecf0f1' : 'black' }}>
        <thead style={{ backgroundColor: theme === 'dark' ? '#1abc9c' : '#34495e', color: 'white' }}>
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
            <tr key={quiz.id} style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}>
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
                  ✏️ Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(quiz.id)}>
                  ❌ Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} centered animation>
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
            <Button className="mt-3" variant="primary" onClick={handleSave} style={{ width: '100%' }}>💾 Save</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <hr className="my-4" />
      <h4 style={{ color: theme === 'dark' ? '#ffffff' : '#2c3e50', marginTop: '40px' }}>Manage Users</h4>
      <Table striped bordered hover responsive style={{ backgroundColor: theme === 'dark' ? '#2c3e50' : '#ffffff', borderRadius: '8px', color: theme === 'dark' ? '#ffffff' : 'black' }}>
        <thead style={{ backgroundColor: theme === 'dark' ? '#1abc9c' : '#2c3e50', color: '#fff' }}>
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
            <tr key={u.id} style={{ transition: 'background-color 0.3s ease' }}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.firstName} {u.lastName}</td>
              <td><Badge bg={u.role === 'ADMIN' ? 'primary' : 'secondary'}>{u.role}</Badge></td>
              <td>
                <Form.Select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  style={{ maxWidth: '150px', backgroundColor: theme === 'dark' ? '#34495e' : '#ecf0f1', color: theme === 'dark' ? 'white' : 'black' }}
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