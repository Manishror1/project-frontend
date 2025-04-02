import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';

const UserProfile = () => {
  const userId = 1; // Replace with dynamic logged-in user ID
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${userId}`);
      setUser(res.data);
    } catch (err) {
      setError('Failed to load profile.');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/users/${userId}`, user);
      setMessage('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (!user) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p>Loading profile...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h4">User Profile</Card.Header>
        <Card.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            {["firstName", "lastName", "email", "username", "password", "role"].map((field) => (
              <Row className="mb-3" key={field}>
                <Col sm={4}>
                  <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                </Col>
                <Col sm={8}>
                  {editMode ? (
                    <Form.Control
                      type={field === "password" ? "password" : "text"}
                      name={field}
                      value={user[field] || ''}
                      onChange={handleChange}
                    />
                  ) : field === "password" ? (
                    <input type="password" value={user.password} disabled className="form-control-plaintext" />
                  ) : (
                    <Form.Control plaintext readOnly defaultValue={user[field]} />
                  )}
                </Col>
              </Row>
            ))}
          </Form>

          {editMode ? (
            <div className="d-flex gap-2 mt-3">
              <Button variant="success" onClick={handleUpdate}>Save Changes</Button>
              <Button variant="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
            </div>
          ) : (
            <Button variant="primary" className="mt-3" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfile;
