import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Container,
  Card,
  CardContent,
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Redirect will happen automatically due to the useEffect above
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: 'officer' | 'admin') => {
    if (role === 'officer') {
      setEmail('officer@springfieldpd.gov');
      setPassword('password123');
    } else {
      setEmail('admin@springfieldpd.gov');
      setPassword('password123');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Card elevation={3} sx={{ width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <LockIcon 
                sx={{ 
                  fontSize: 40, 
                  mb: 2, 
                  color: 'primary.main',
                  backgroundColor: 'primary.light',
                  p: 1,
                  borderRadius: '50%'
                }} 
              />
              <Typography component="h1" variant="h4" gutterBottom>
                APB System
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Law Enforcement Portal
              </Typography>
              <Typography component="h2" variant="h5" gutterBottom sx={{ mt: 2 }}>
                Sign In
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>
              </Box>

              {/* Demo Login Buttons */}
              <Box sx={{ mt: 3, width: '100%' }}>
                <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
                  Demo Accounts:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleDemoLogin('officer')}
                    disabled={isLoading}
                    size="small"
                  >
                    Officer Demo
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleDemoLogin('admin')}
                    disabled={isLoading}
                    size="small"
                  >
                    Admin Demo
                  </Button>
                </Box>
              </Box>

              {/* Demo Credentials Info */}
              <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1, width: '100%' }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Demo Credentials:</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Officer: officer@springfieldpd.gov / password123
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Admin: admin@springfieldpd.gov / password123
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;