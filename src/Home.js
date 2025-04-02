import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role?.toLowerCase(); // Handle uppercase roles like "ADMIN"

  return (
    <Container className="text-center mt-5">
      <h1>Welcome to QuizChamp 🧠</h1>
      {!user ? (
        <>
          <p className="lead">Please login or register to get started.</p>
          <Link to="/login">
            <Button variant="primary" className="me-2">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline-secondary">Register</Button>
          </Link>
        </>
      ) : (
        <>
          <p className="lead">Welcome back, {user.firstName}!</p>
          <Link to={userRole === 'admin' ? '/admin' : '/player'}>
            <Button variant="success">Go to Dashboard</Button>
          </Link>
        </>
      )}
    </Container>
  );
};

export default Home;
