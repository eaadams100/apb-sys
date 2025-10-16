import { useState, useEffect } from 'react';
import { Bulletin } from '../types';
import { bulletinAPI } from '../services/api';
import { useSocket } from './useSocket';

export const useBulletins = () => {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    fetchBulletins();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('bulletin:new', (newBulletin: Bulletin) => {
      setBulletins(prev => [newBulletin, ...prev]);
    });

    socket.on('bulletin:update', (updatedBulletin: Bulletin) => {
      setBulletins(prev => 
        prev.map(bulletin => 
          bulletin.id === updatedBulletin.id ? updatedBulletin : bulletin
        )
      );
    });

    socket.on('bulletin:delete', (deletedId: string) => {
      setBulletins(prev => prev.filter(bulletin => bulletin.id !== deletedId));
    });

    return () => {
      socket.off('bulletin:new');
      socket.off('bulletin:update');
      socket.off('bulletin:delete');
    };
  }, [socket]);

  const fetchBulletins = async () => {
    try {
      setLoading(true);
      // For now, using mock data. Replace with actual API call:
      // const response = await bulletinAPI.getBulletins();
      // setBulletins(response.data);
      
      // Mock data
      const mockBulletins: Bulletin[] = [
        {
          id: '1',
          subject: 'Armed Robbery Suspect - Downtown Area',
          description: 'Male suspect, approximately 25-30 years old, armed with handgun. Last seen fleeing in white sedan.',
          type: 'BOLO',
          priority: 'HIGH',
          status: 'ACTIVE',
          location: {
            lat: 34.0522,
            lng: -118.2437,
            address: 'Downtown Los Angeles'
          },
          agencies: ['agency1', 'agency2'],
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date(),
          suspectInfo: {
            name: 'John Doe',
            age: 28,
            height: "5'10\"",
            weight: '180 lbs',
            hairColor: 'Brown',
            lastSeen: new Date(),
            clothing: 'Blue jeans, black hoodie',
            weapons: ['Handgun']
          },
          media: []
        }
      ];
      setBulletins(mockBulletins);
    } catch (error) {
      console.error('Failed to fetch bulletins:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBulletin = async (bulletin: Omit<Bulletin, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // const response = await bulletinAPI.createBulletin(bulletin);
      // setBulletins(prev => [response.data, ...prev]);
      
      // Mock creation
      const newBulletin: Bulletin = {
        ...bulletin,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setBulletins(prev => [newBulletin, ...prev]);
      return newBulletin;
    } catch (error) {
      console.error('Failed to create bulletin:', error);
      throw error;
    }
  };

  return {
    bulletins,
    loading,
    createBulletin,
    refetch: fetchBulletins,
  };
};