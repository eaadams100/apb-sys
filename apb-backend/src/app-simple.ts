import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running!' });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, password });
  
  if (email === 'officer@springfieldpd.gov' && password === 'password123') {
    res.json({
      user: {
        id: 'test-user-1',
        email: 'officer@springfieldpd.gov',
        name: 'John Officer',
        agencyId: 'test-agency-1',
        role: 'officer'
      },
      token: 'test-jwt-token-for-now'
    });
  } else if (email === 'admin@springfieldpd.gov' && password === 'password123') {
    res.json({
      user: {
        id: 'test-user-2', 
        email: 'admin@springfieldpd.gov',
        name: 'Admin User',
        agencyId: 'test-agency-1',
        role: 'admin'
      },
      token: 'test-jwt-token-for-admin'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Mock data endpoints
app.get('/api/agencies', (req, res) => {
  res.json([
    {
      id: 'test-agency-1',
      name: 'Springfield Police Department',
      jurisdiction: 'Springfield',
      location: { lat: 39.781, lng: -89.644 }
    }
  ]);
});

app.get('/api/bulletins', (req, res) => {
  res.json([
    {
      id: 'test-bulletin-1',
      subject: 'Armed Robbery Suspect',
      description: 'Test bulletin description',
      type: 'BOLO',
      priority: 'HIGH',
      status: 'ACTIVE',
      location: { lat: 39.781, lng: -89.644, address: '123 Main St' },
      agencies: ['test-agency-1'],
      createdBy: 'test-user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      media: []
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`🚀 SIMPLE APB Backend running on port ${PORT}`);
});