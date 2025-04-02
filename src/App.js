import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

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
import ScoreHistory from './ScoreHistory';
import AppNavbar from './Navbar';

// ✅ ProtectedRoute component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !allowedRoles.includes(user.role.toUpperCase())) {
    return <Navigate to="/login" />;
  }
  return element;
};

const App = () => {
  const location = window.location.pathname;
  const hideNavbarPaths = ['/', '/login', '/register'];
  const showNavbar = !hideNavbarPaths.includes(location);

  return (
    <Router>
      {showNavbar && <AppNavbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
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
        <Route
          path="/score-history"
          element={
            <ProtectedRoute allowedRoles={['PLAYER', 'ADMIN']} element={<ScoreHistory />} />
          }
        />

        {/* Shared Routes */}
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/quiz/:id" element={<QuizDetails />} />
        <Route path="/play-quiz/:quizId" element={<PlayQuiz />} />
        <Route path="/scoreboard" element={<ScoreBoard />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
