import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import RepositoryDetail from './pages/RepositoryDetail';
import PullRequestReview from './pages/PullRequestReview';
import Settings from './pages/Settings';
import AuthCallback from './pages/AuthCallback';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--bg-card)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
    </div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/repos/:repoId"
              element={
                <ProtectedRoute>
                  <RepositoryDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/repos/:repoId/pulls/:prId"
              element={
                <ProtectedRoute>
                  <PullRequestReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
