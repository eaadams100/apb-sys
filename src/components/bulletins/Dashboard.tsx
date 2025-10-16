import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Box,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  ViewList as ListIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import APBMap from '../maps/APBMap';
import SearchBar from '../common/SearchBar';
import { Bulletin } from '../../types';
import './Dashboard.css';

interface DashboardProps {
  bulletins: Bulletin[];
}

const Dashboard: React.FC<DashboardProps> = ({ bulletins }) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedBulletin, setSelectedBulletin] = useState<Bulletin | null>(null);

  const handleBulletinClick = (bulletin: Bulletin) => {
    setSelectedBulletin(bulletin);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="dashboard-container">
      <div className={`dashboard-main ${selectedBulletin ? 'with-details' : 'full-width'}`}>
        <Paper sx={{ height: '100%', position: 'relative' }}>
          
          {/* Toolbar */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <div className="toolbar">
              <div className="search-section">
                <SearchBar />
              </div>
              <div className="controls-section">
                <IconButton 
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon />
                </IconButton>
                <IconButton 
                  color={viewMode === 'map' ? 'primary' : 'default'}
                  onClick={() => setViewMode('map')}
                >
                  <MapIcon />
                </IconButton>
                <IconButton>
                  <FilterIcon />
                </IconButton>
              </div>
            </div>
          </Box>

          {/* Content Area */}
          <div className="content-area">
            {viewMode === 'map' ? (
              <APBMap
                bulletins={bulletins}
                onBulletinClick={handleBulletinClick}
              />
            ) : (
              <Box sx={{ p: 2 }}>
                <div className="bulletins-list">
                  {bulletins.map((bulletin) => (
                    <div className="bulletin-item" key={bulletin.id}>
                      <Card 
                        variant="outlined"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleBulletinClick(bulletin)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <Box>
                              <Typography variant="h6" component="h2">
                                {bulletin.subject}
                              </Typography>
                              <Typography color="textSecondary" gutterBottom>
                                {bulletin.location.address}
                              </Typography>
                              <Typography variant="body2">
                                {bulletin.description}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 1 }}>
                              <Chip 
                                label={bulletin.priority} 
                                color={getPriorityColor(bulletin.priority) as any}
                                size="small"
                              />
                              <Chip 
                                label={bulletin.type} 
                                variant="outlined"
                                size="small"
                              />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </Box>
            )}
          </div>
        </Paper>
      </div>

      {/* Bulletin Detail Panel */}
      {selectedBulletin && (
        <div className="details-panel">
          <Paper sx={{ height: '100%', p: 2, overflow: 'auto' }}>
            <Typography variant="h5" gutterBottom>
              {selectedBulletin.subject}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={selectedBulletin.status} 
                color={selectedBulletin.status === 'ACTIVE' ? 'success' : 'default'}
                sx={{ mr: 1 }}
              />
              <Chip 
                label={selectedBulletin.priority} 
                color={getPriorityColor(selectedBulletin.priority) as any}
                sx={{ mr: 1 }}
              />
              <Chip 
                label={selectedBulletin.type} 
                variant="outlined"
              />
            </Box>

            <Typography variant="body1" paragraph>
              {selectedBulletin.description}
            </Typography>

            {selectedBulletin.suspectInfo && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Suspect Information
                </Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {selectedBulletin.suspectInfo.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Age:</strong> {selectedBulletin.suspectInfo.age}
                </Typography>
                <Typography variant="body2">
                  <strong>Height/Weight:</strong> {selectedBulletin.suspectInfo.height} / {selectedBulletin.suspectInfo.weight}
                </Typography>
                <Typography variant="body2">
                  <strong>Hair:</strong> {selectedBulletin.suspectInfo.hairColor}
                </Typography>
                <Typography variant="body2">
                  <strong>Clothing:</strong> {selectedBulletin.suspectInfo.clothing}
                </Typography>
                <Typography variant="body2">
                  <strong>Weapons:</strong> {selectedBulletin.suspectInfo.weapons.join(', ')}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="h6" gutterBottom>
                Location
              </Typography>
              <Typography variant="body2">
                {selectedBulletin.location.address}
              </Typography>
            </Box>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default Dashboard;