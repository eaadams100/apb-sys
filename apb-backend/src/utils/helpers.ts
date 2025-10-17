import { Bulletin } from '../types';

export const helpers = {
  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  },

  deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  },

  // Format bulletin for display
  formatBulletinForDisplay(bulletin: Bulletin) {
    return {
      ...bulletin,
      formattedCreatedAt: new Date(bulletin.createdAt).toLocaleString(),
      formattedUpdatedAt: new Date(bulletin.updatedAt).toLocaleString(),
      isUrgent: bulletin.priority === 'URGENT'
    };
  },

  // Generate random ID
  generateId(prefix: string = ''): string {
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  },

  // Sanitize user input
  sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  },

  // Validate coordinates
  isValidCoordinate(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  },

  // Get priority color
  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'URGENT': '#ff4444',
      'HIGH': '#ff8800',
      'MEDIUM': '#ffbb33',
      'LOW': '#33b5e5'
    };
    return colors[priority] || '#2BBBAD';
  }
};

// Export individual functions as well
export const { 
  calculateDistance, 
  formatBulletinForDisplay, 
  generateId,
  sanitizeInput,
  isValidCoordinate,
  getPriorityColor 
} = helpers;