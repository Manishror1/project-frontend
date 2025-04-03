import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role?.toLowerCase();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
      }}
    >
      <Card
        style={{
          maxWidth: '600px',
          width: '100%',
          padding: '40px',
          borderRadius: '25px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          textAlign: 'center',
          background: 'white',
        }}
      >
        <h1 className="mb-3" style={{ fontWeight: 'bold', color: '#343a40' }}>
          Welcome to <span style={{ color: '#2c3e50' }}>QuizChamp</span> 🧠
        </h1>

        {!user ? (
          <>
            <p className="lead mb-4" style={{ fontSize: '1.2rem', color: '#555' }}>
              Please login or register to begin your quiz journey.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/login">
                <Button variant="primary" size="lg">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline-dark" size="lg">
                  Register
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="lead mb-4" style={{ fontSize: '1.2rem', color: '#555' }}>
              Welcome back, <strong>{user.firstName}</strong>!
            </p>
            <Link to={userRole === 'admin' ? '/admin' : '/player'}>
              <Button variant="success" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          </>
        )}
      </Card>
    </div>
  );
};

export default Home;
