import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/layout/Layout';
import Dashboard from './components/bulletins/Dashboard';
import CreateBulletin from './components/bulletins/CreateBulletin';
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

function App() {
  const { bulletins, createBulletin } = useBulletins();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route 
              path="/" 
              element={<Dashboard bulletins={bulletins} />} 
            />
            <Route 
              path="/create" 
              element={<CreateBulletin onSubmit={createBulletin} />} 
            />
            <Route 
              path="/bulletins" 
              element={<div>All Bulletins Page - Coming Soon</div>} 
            />
            <Route 
              path="/agency" 
              element={<div>My Agency Page - Coming Soon</div>} 
            />
            <Route 
              path="/admin" 
              element={<div>Admin Page - Coming Soon</div>} 
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;