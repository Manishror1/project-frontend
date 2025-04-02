import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap';
import { FaEnvelope, FaUser, FaKey, FaIdBadge, FaUserShield } from 'react-icons/fa';

const UserProfile = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userId = currentUser?.id;

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${userId}`);
      setUser(res.data);
    } catch {
      setError('Failed to load profile.');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/users/${userId}`, user);
      setMessage('✅ Profile updated successfully!');
      setEditMode(false);
      localStorage.setItem('user', JSON.stringify(user));
    } catch {
      setError('❌ Failed to update profile.');
    }
  };

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>Loading profile...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card
        className="p-4 shadow-lg"
        style={{
          width: '100%',
          maxWidth: '750px',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(16px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Card.Header
          className="text-white text-center fs-3 fw-bold"
          style={{
            background: 'linear-gradient(to right, #007bff, #6610f2)',
            borderRadius: '15px',
            padding: '1rem',
            marginBottom: '2rem'
          }}
        >
          👤 User Profile
        </Card.Header>

        <Card.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            {[
              { label: 'ID', key: 'id', icon: <FaIdBadge /> },
              { label: 'First Name', key: 'firstName', icon: <FaUser /> },
              { label: 'Last Name', key: 'lastName', icon: <FaUser /> },
              { label: 'Email', key: 'email', icon: <FaEnvelope /> },
              { label: 'Username', key: 'username', icon: <FaUser /> },
              { label: 'Password', key: 'password', icon: <FaKey /> },
              { label: 'Role', key: 'role', icon: <FaUserShield /> }
            ].map(({ label, key, icon }) => (
              <Row className="mb-3 align-items-center" key={key}>
                <Col sm={4} className="text-secondary fw-semibold">
                  {icon} {label}:
                </Col>
                <Col sm={8}>
                  {['id', 'role'].includes(key) ? (
                    <Form.Control
                      readOnly
                      plaintext
                      value={user[key]}
                      className="text-dark"
                    />
                  ) : editMode ? (
                    <Form.Control
                      type={key === 'password' ? 'password' : 'text'}
                      name={key}
                      value={user[key] || ''}
                      onChange={handleChange}
                      className="shadow-sm"
                    />
                  ) : (
                    <Form.Control
                      readOnly
                      plaintext
                      type={key === 'password' ? 'password' : 'text'}
                      value={user[key]}
                      className="text-dark"
                    />
                  )}
                </Col>
              </Row>
            ))}
          </Form>

          <div className="text-center mt-4">
            {editMode ? (
              <>
                <Button
                  variant="success"
                  className="me-2 px-4 shadow"
                  onClick={handleUpdate}
                >
                  💾 Save
                </Button>
                <Button
                  variant="outline-secondary"
                  className="px-4"
                  onClick={() => setEditMode(false)}
                >
                  ❌ Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                className="px-4 shadow"
                onClick={() => setEditMode(true)}
              >
                ✏️ Edit Profile
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfile;
