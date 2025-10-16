import { Request, Response } from 'express';
import { BulletinModel } from '../models/Bulletin.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { io } from '../app';

export const createBulletin = async (req: AuthRequest, res: Response) => {
  try {
    const bulletinData = {
      ...req.body,
      createdBy: req.user.id,
      status: 'ACTIVE'
    };

    const bulletin = await BulletinModel.create(bulletinData);

    // Emit real-time event to relevant agencies
    bulletin.agencies.forEach((agencyId: any) => {
      io.to(`agency:${agencyId}`).emit('bulletin:new', bulletin);
    });

    res.status(201).json(bulletin);
  } catch (error) {
    console.error('Create bulletin error:', error);
    res.status(500).json({ error: 'Failed to create bulletin' });
  }
};

export const getBulletins = async (req: AuthRequest, res: Response) => {
  try {
    // Get bulletins for user's agency
    const bulletins = await BulletinModel.findByAgency(req.user.agencyId);
    res.json(bulletins);
  } catch (error) {
    console.error('Get bulletins error:', error);
    res.status(500).json({ error: 'Failed to fetch bulletins' });
  }
};

export const getBulletin = async (req: AuthRequest, res: Response) => {
  try {
    const bulletin = await BulletinModel.findById(req.params.id);
    
    if (!bulletin) {
      return res.status(404).json({ error: 'Bulletin not found' });
    }

    // Check if user's agency has access to this bulletin
    if (!bulletin.agencies.includes(req.user.agencyId)) {
      return res.status(403).json({ error: 'Access denied to this bulletin' });
    }

    res.json(bulletin);
  } catch (error) {
    console.error('Get bulletin error:', error);
    res.status(500).json({ error: 'Failed to fetch bulletin' });
  }
};

export const updateBulletin = async (req: AuthRequest, res: Response) => {
  try {
    const bulletin = await BulletinModel.findById(req.params.id);
    
    if (!bulletin) {
      return res.status(404).json({ error: 'Bulletin not found' });
    }

    // Check permissions (only creator or admin can update)
    if (bulletin.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this bulletin' });
    }

    const updatedBulletin = await BulletinModel.update(req.params.id, req.body);

    if (updatedBulletin) {
      // Emit update event
      updatedBulletin.agencies.forEach((agencyId: any) => {
        io.to(`agency:${agencyId}`).emit('bulletin:update', updatedBulletin);
      });
    }

    res.json(updatedBulletin);
  } catch (error) {
    console.error('Update bulletin error:', error);
    res.status(500).json({ error: 'Failed to update bulletin' });
  }
};

export const getNearbyBulletins = async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lng, radius = 50 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const bulletins = await BulletinModel.findNearby(
      parseFloat(lat as string),
      parseFloat(lng as string),
      parseFloat(radius as string)
    );

    // Filter to only include bulletins accessible to user's agency
    const accessibleBulletins = bulletins.filter(bulletin =>
      bulletin.agencies.includes(req.user.agencyId)
    );

    res.json(accessibleBulletins);
  } catch (error) {
    console.error('Get nearby bulletins error:', error);
    res.status(500).json({ error: 'Failed to fetch nearby bulletins' });
  }
};