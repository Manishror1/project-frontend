import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  // ❌ Hide navbar on login, register, or home
  if (
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/'
  ) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar
      expand="lg"
      style={{ backgroundColor: '#002147' }}
      variant="dark"
      className="shadow-sm px-3"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
          QuizChamp 🧠
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" className="text-white mx-2">
              Home
            </Nav.Link>
            <Nav.Link
              as={Link} to='/player' className="text-white mx-2"
            >
         Quizes
            </Nav.Link>
            <Nav.Link as={Link} to="/scoreboard" className="text-white mx-2">
              Leaderboard
            </Nav.Link>
            <Nav.Link as={Link} to="/score-history" className="text-white mx-2">
              Score History
            </Nav.Link>
          </Nav>

          <Nav className="d-flex align-items-center">
            <Button
              as={Link}
              to="/profile"
              variant="light"
              size="sm"
              className="me-3 rounded-pill"
            >
              <FaUserCircle className="me-1" /> Profile
            </Button>
            <Button
              variant="link"
              className="text-decoration-none text-white fw-bold"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
