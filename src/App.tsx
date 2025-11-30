import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./pages/AuthContext"; 
import Login from "./pages/Login/Login"; 
import Dashboard from "./pages/Dashboard"; // This is your Task View
import Projects from "./pages/projects";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Main Dashboard now shows Projects */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

          {/* New Route: Specific Project Tasks */}
          <Route
            path="/projects/:projectId/tasks"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;