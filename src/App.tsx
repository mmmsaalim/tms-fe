import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./pages/AuthContext"; // Adjust path if needed
import Login from "./pages/Login/Login"; // Adjust path if needed
import Dashboard from "./pages/Dashboard"; // Adjust path if needed

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  // 1. If we are still checking local storage, show a spinner or nothing
  if (loading) {
    return <div className="vh-100 d-flex justify-content-center align-items-center">Loading...</div>; 
  }

  // 2. Only redirect IF loading is finished AND user is not authenticated
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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;