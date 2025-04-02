import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import PlayerDashboard from './PlayerDashboard';
import QuizList from './QuizList';
import QuizDetails from './QuizDetails';
import PlayQuiz from './PlayQuiz';
import ScoreBoard from './ScoreBoard';
import UserProfile from './UserProfile';
import AppNavbar from './Navbar';

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }
  return Component;
};

const App = () => {
  const location = window.location.pathname;
  const showNavbar = !['/login', '/register', '/'].includes(location);

  return (
    <Router>
      {showNavbar && <AppNavbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']} element={<AdminDashboard />} />
          }
        />
        <Route
          path="/player"
          element={
            <ProtectedRoute allowedRoles={['PLAYER', 'ADMIN']} element={<PlayerDashboard />} />
          }
        />
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/quiz/:id" element={<QuizDetails />} />
        <Route path="/play-quiz/:quizId" element={<PlayQuiz />} />
        <Route path="/scoreboard" element={<ScoreBoard />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
