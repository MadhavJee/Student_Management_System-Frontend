import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
        <Route path="/students" element={<ErrorBoundary><Students /></ErrorBoundary>} />
        <Route path="/courses" element={<ErrorBoundary><Courses /></ErrorBoundary>} />
        <Route path="/attendance" element={<ErrorBoundary><Attendance /></ErrorBoundary>} />
        <Route path="/grades" element={<ErrorBoundary><Grades /></ErrorBoundary>} />
      </Route>
    </Routes>
  );
}
