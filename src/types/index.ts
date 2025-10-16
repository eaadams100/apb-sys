export interface User {
  id: string;
  email: string;
  name: string;
  agencyId: string;
  role: 'officer' | 'admin' | 'dispatcher';
}

export interface Agency {
  id: string;
  name: string;
  jurisdiction: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Bulletin {
  id: string;
  subject: string;
  description: string;
  type: 'BOLO' | 'MISSING_PERSON' | 'GENERAL_ALERT' | 'VEHICLE' | 'WANTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'ACTIVE' | 'RESOLVED' | 'EXPIRED';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  agencies: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  
  suspectInfo?: {
    name: string;
    age: number;
    height: string;
    weight: string;
    hairColor: string;
    lastSeen: Date;
    clothing: string;
    weapons: string[];
  };
  
  media: MediaAttachment[];
}

export interface MediaAttachment {
  id: string;
  filename: string;
  url: string;
  type: 'image' | 'video' | 'document';
  uploadedAt: Date;
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
}