import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './components/bulletins/Dashboard';
import CreateBulletin from './components/bulletins/CreateBulletin';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useBulletins } from './hooks/useBulletins';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

// Component that uses the auth hook
const AppContent: React.FC = () => {
  const { bulletins, createBulletin } = useBulletins();
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Routes>
        {/* Public route */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard bulletins={bulletins} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create" 
          element={
            <ProtectedRoute>
              <CreateBulletin onSubmit={createBulletin} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bulletins" 
          element={
            <ProtectedRoute>
              <div>All Bulletins Page - Coming Soon</div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/agency" 
          element={
            <ProtectedRoute>
              <div>My Agency Page - Coming Soon</div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <div>Admin Page - Coming Soon</div>
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;