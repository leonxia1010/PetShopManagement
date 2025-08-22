import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { AuthGate } from './auth/AuthGate'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import DashboardPage from './pages/DashboardPage'
import BookingsPage from './pages/BookingsPage'
import TasksPage from './pages/TasksPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <AuthGate>
                <HomePage />
              </AuthGate>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGate>
                <DashboardPage />
              </AuthGate>
            }
          />
          <Route
            path="/bookings"
            element={
              <AuthGate>
                <BookingsPage />
              </AuthGate>
            }
          />
          <Route
            path="/tasks/today"
            element={
              <AuthGate>
                <TasksPage />
              </AuthGate>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
