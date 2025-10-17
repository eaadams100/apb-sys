import { Request, Response } from 'express';
import { AgencyModel } from '../models/Agency.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllAgencies = async (req: AuthRequest, res: Response) => {
  try {
    const agencies = await AgencyModel.findAll();
    res.json(agencies);
  } catch (error) {
    console.error('Get agencies error:', error);
    res.status(500).json({ error: 'Failed to fetch agencies' });
  }
};

export const getAgencyById = async (req: AuthRequest, res: Response) => {
  try {
    const agency = await AgencyModel.findById(req.params.id);
    
    if (!agency) {
      return res.status(404).json({ error: 'Agency not found' });
    }

    res.json(agency);
  } catch (error) {
    console.error('Get agency error:', error);
    res.status(500).json({ error: 'Failed to fetch agency' });
  }
};

export const createAgency = async (req: AuthRequest, res: Response) => {
  try {
    // Only admins can create agencies
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, jurisdiction, lat, lng } = req.body;

    if (!name || !jurisdiction || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const agency = await AgencyModel.create({
      name,
      jurisdiction,
      location: { lat, lng }
    });

    res.status(201).json(agency);
  } catch (error) {
    console.error('Create agency error:', error);
    res.status(500).json({ error: 'Failed to create agency' });
  }
};

export const getMyAgency = async (req: AuthRequest, res: Response) => {
  try {
    const agency = await AgencyModel.findById(req.user.agencyId);
    
    if (!agency) {
      return res.status(404).json({ error: 'Agency not found' });
    }

    res.json(agency);
  } catch (error) {
    console.error('Get my agency error:', error);
    res.status(500).json({ error: 'Failed to fetch agency' });
  }
};