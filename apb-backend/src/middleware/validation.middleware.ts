import { Request, Response, NextFunction } from 'express';

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

export const validateBulletin = (req: Request, res: Response, next: NextFunction) => {
  const { subject, description, type, priority, location, agencies } = req.body;

  if (!subject || !description || !type || !priority || !location || !agencies) {
    return res.status(400).json({ 
      error: 'Subject, description, type, priority, location, and agencies are required' 
    });
  }

  if (!location.lat || !location.lng || !location.address) {
    return res.status(400).json({ 
      error: 'Location must include lat, lng, and address' 
    });
  }

  if (!Array.isArray(agencies) || agencies.length === 0) {
    return res.status(400).json({ 
      error: 'Agencies must be a non-empty array' 
    });
  }

  const validTypes = ['BOLO', 'MISSING_PERSON', 'GENERAL_ALERT', 'VEHICLE', 'WANTED'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ 
      error: `Type must be one of: ${validTypes.join(', ')}` 
    });
  }

  const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ 
      error: `Priority must be one of: ${validPriorities.join(', ')}` 
    });
  }

  next();
};

export const validateAgency = (req: Request, res: Response, next: NextFunction) => {
  const { name, jurisdiction, lat, lng } = req.body;

  if (!name || !jurisdiction || lat === undefined || lng === undefined) {
    return res.status(400).json({ 
      error: 'Name, jurisdiction, lat, and lng are required' 
    });
  }

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ 
      error: 'Lat and lng must be numbers' 
    });
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return res.status(400).json({ 
      error: 'Invalid coordinates' 
    });
  }

  next();
};

// Helper function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};