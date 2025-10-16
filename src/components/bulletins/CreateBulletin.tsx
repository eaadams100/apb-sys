import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  IconButton,
  Checkbox,
  Divider,
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  Publish as PublishIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import APBMap from '../maps/APBMap';
import { Bulletin } from '../../types';
import './CreateBulletin.css';

interface CreateBulletinProps {
  onSubmit: (bulletin: Omit<Bulletin, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const CreateBulletin: React.FC<CreateBulletinProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    type: 'BOLO' as Bulletin['type'],
    priority: 'MEDIUM' as Bulletin['priority'],
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: '',
    },
    agencies: [] as string[],
    suspectInfo: {
      name: '',
      age: 0,
      height: '',
      weight: '',
      hairColor: '',
      lastSeen: new Date(),
      clothing: '',
      weapons: [] as string[],
    },
    media: [] as Bulletin['media'],
  });

  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [weaponInput, setWeaponInput] = useState('');

  const agencies = [
    { id: 'agency1', name: 'Springfield Police Department' },
    { id: 'agency2', name: 'County Sheriff Office' },
    { id: 'agency3', name: 'State Police' },
    { id: 'agency4', name: 'Highway Patrol' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.description || !formData.location.address) {
      alert('Please fill in all required fields: Subject, Description, and Location');
      return;
    }

    const bulletinData: Omit<Bulletin, 'id' | 'createdAt' | 'updatedAt'> = {
      subject: formData.subject,
      description: formData.description,
      type: formData.type,
      priority: formData.priority,
      location: formData.location,
      agencies: formData.agencies,
      status: 'ACTIVE',
      createdBy: 'current-user',
      media: formData.media,
      suspectInfo: formData.suspectInfo.name ? formData.suspectInfo : undefined,
    };

    onSubmit(bulletinData);
    
    setFormData({
      subject: '',
      description: '',
      type: 'BOLO',
      priority: 'MEDIUM',
      location: {
        lat: 34.0522,
        lng: -118.2437,
        address: '',
      },
      agencies: [],
      suspectInfo: {
        name: '',
        age: 0,
        height: '',
        weight: '',
        hairColor: '',
        lastSeen: new Date(),
        clothing: '',
        weapons: [],
      },
      media: [],
    });
    setIsSelectingLocation(false);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSuspectInfoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      suspectInfo: {
        ...prev.suspectInfo,
        [field]: value,
      },
    }));
  };

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      location: {
        lat: location.lat,
        lng: location.lng,
        address: `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`,
      },
    }));
    setIsSelectingLocation(false);
  };

  const handleAddWeapon = () => {
    if (weaponInput.trim()) {
      setFormData(prev => ({
        ...prev,
        suspectInfo: {
          ...prev.suspectInfo,
          weapons: [...prev.suspectInfo.weapons, weaponInput.trim()],
        },
      }));
      setWeaponInput('');
    }
  };

  const handleRemoveWeapon = (index: number) => {
    setFormData(prev => ({
      ...prev,
      suspectInfo: {
        ...prev.suspectInfo,
        weapons: prev.suspectInfo.weapons.filter((_, i) => i !== index),
      },
    }));
  };

  const handleWeaponKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddWeapon();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newMedia: Bulletin['media'] = Array.from(files).map((file, index) => ({
      id: `media-${Date.now()}-${index}`,
      filename: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'document',
      uploadedAt: new Date(),
    }));

    setFormData(prev => ({
      ...prev,
      media: [...prev.media, ...newMedia],
    }));
  };

  const handleRemoveMedia = (mediaId: string) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter(media => media.id !== mediaId),
    }));
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, margin: '0 auto', maxHeight: '90vh', overflow: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Bulletin
      </Typography>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          
          {/* Subject */}
          <div className="form-field full-width">
            <TextField
              fullWidth
              label="Subject *"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              required
              placeholder="e.g., Armed Robbery Suspect - Downtown Area"
              helperText="Brief, descriptive title for the bulletin"
            />
          </div>

          {/* Type and Priority */}
          <div className="form-field half-width">
            <FormControl fullWidth>
              <InputLabel>Type *</InputLabel>
              <Select
                value={formData.type}
                label="Type *"
                onChange={(e) => handleChange('type', e.target.value)}
                required
              >
                <MenuItem value="BOLO">BOLO (Be On Lookout)</MenuItem>
                <MenuItem value="MISSING_PERSON">Missing Person</MenuItem>
                <MenuItem value="WANTED">Wanted Person</MenuItem>
                <MenuItem value="VEHICLE">Vehicle Alert</MenuItem>
                <MenuItem value="GENERAL_ALERT">General Alert</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="form-field half-width">
            <FormControl fullWidth>
              <InputLabel>Priority *</InputLabel>
              <Select
                value={formData.priority}
                label="Priority *"
                onChange={(e) => handleChange('priority', e.target.value)}
                required
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Location */}
          <div className="form-field full-width">
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Location *</Typography>
                </Box>
                
                <div className="location-grid">
                  <div className="location-field">
                    <TextField
                      fullWidth
                      label="Address"
                      value={formData.location.address}
                      onChange={(e) => handleChange('location', {
                        ...formData.location,
                        address: e.target.value
                      })}
                      placeholder="Enter address or location details"
                      required
                      helperText="Click the map to set coordinates or enter address manually"
                    />
                    
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<LocationIcon />}
                        onClick={() => setIsSelectingLocation(!isSelectingLocation)}
                      >
                        {isSelectingLocation ? 'Cancel Location Selection' : 'Select on Map'}
                      </Button>
                    </Box>

                    {formData.location.lat && formData.location.lng && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Coordinates: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                      </Typography>
                    )}
                  </div>
                  
                  <div className="map-field">
                    <Box sx={{ height: 200, border: '1px solid #ddd', borderRadius: 1 }}>
                      <APBMap
                        bulletins={[]}
                        onBulletinClick={() => {}}
                        onLocationSelect={isSelectingLocation ? handleLocationSelect : undefined}
                        isSelectingLocation={isSelectingLocation}
                      />
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      {isSelectingLocation 
                        ? 'Click on the map to set the location' 
                        : 'Enable "Select on Map" to choose coordinates'
                      }
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <div className="form-field full-width">
            <TextField
              fullWidth
              label="Description *"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              multiline
              rows={4}
              placeholder="Provide detailed description of the incident, suspect, or situation. Include relevant details, last known direction of travel, vehicle information, etc."
              helperText="Be specific and include all relevant details for officer safety"
            />
          </div>

          <div className="form-field full-width">
            <Divider />
          </div>

          {/* Suspect Information */}
          <div className="form-field full-width">
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Suspect Information (Optional)
                </Typography>
                
                <div className="suspect-grid">
                  <div className="suspect-field">
                    <TextField
                      fullWidth
                      label="Name"
                      value={formData.suspectInfo.name}
                      onChange={(e) => handleSuspectInfoChange('name', e.target.value)}
                      placeholder="Suspect name if known"
                    />
                  </div>
                  
                  <div className="suspect-field">
                    <TextField
                      fullWidth
                      label="Age"
                      type="number"
                      value={formData.suspectInfo.age || ''}
                      onChange={(e) => handleSuspectInfoChange('age', parseInt(e.target.value) || 0)}
                      placeholder="Approximate age"
                    />
                  </div>
                  
                  <div className="suspect-field">
                    <TextField
                      fullWidth
                      label="Height"
                      value={formData.suspectInfo.height}
                      onChange={(e) => handleSuspectInfoChange('height', e.target.value)}
                      placeholder="e.g., 5'10\"
                    />
                  </div>
                  
                  <div className="suspect-field">
                    <TextField
                      fullWidth
                      label="Weight"
                      value={formData.suspectInfo.weight}
                      onChange={(e) => handleSuspectInfoChange('weight', e.target.value)}
                      placeholder="e.g., 180 lbs"
                    />
                  </div>
                  
                  <div className="suspect-field">
                    <TextField
                      fullWidth
                      label="Hair Color"
                      value={formData.suspectInfo.hairColor}
                      onChange={(e) => handleSuspectInfoChange('hairColor', e.target.value)}
                      placeholder="e.g., Brown, Black, Blonde"
                    />
                  </div>
                  
                  <div className="suspect-field">
                    <TextField
                      fullWidth
                      label="Clothing Description"
                      value={formData.suspectInfo.clothing}
                      onChange={(e) => handleSuspectInfoChange('clothing', e.target.value)}
                      placeholder="e.g., Blue jeans, black hoodie, white shoes"
                    />
                  </div>
                  
                  <div className="suspect-field full-row">
                    <Typography variant="subtitle2" gutterBottom>
                      Weapons
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        size="small"
                        placeholder="Add weapon description"
                        value={weaponInput}
                        onChange={(e) => setWeaponInput(e.target.value)}
                        onKeyPress={handleWeaponKeyPress}
                        sx={{ flexGrow: 1 }}
                      />
                      <Button 
                        variant="outlined" 
                        onClick={handleAddWeapon}
                        disabled={!weaponInput.trim()}
                      >
                        Add
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.suspectInfo.weapons.map((weapon, index) => (
                        <Chip
                          key={index}
                          label={weapon}
                          onDelete={() => handleRemoveWeapon(index)}
                          size="small"
                        />
                      ))}
                    </Box>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agencies */}
          <div className="form-field full-width">
            <FormControl fullWidth>
              <InputLabel>Distribute To Agencies *</InputLabel>
              <Select
                multiple
                value={formData.agencies}
                label="Distribute To Agencies *"
                onChange={(e) => handleChange('agencies', e.target.value)}
                required
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={agencies.find(a => a.id === value)?.name || value} 
                        size="small" 
                      />
                    ))}
                  </Box>
                )}
              >
                {agencies.map((agency) => (
                  <MenuItem key={agency.id} value={agency.id}>
                    <Checkbox checked={formData.agencies.indexOf(agency.id) > -1} />
                    {agency.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Media Attachments */}
          <div className="form-field full-width">
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Media Attachments
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <input
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    id="media-upload"
                    multiple
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="media-upload">
                    <Button variant="outlined" component="span" startIcon={<AddIcon />}>
                      Add Photos, Videos, or Documents
                    </Button>
                  </label>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Supported: Images, Videos, PDF, Word documents
                  </Typography>
                </Box>

                {formData.media.length > 0 && (
                  <div className="media-grid">
                    {formData.media.map((media) => (
                      <div className="media-item" key={media.id}>
                        <Card variant="outlined" sx={{ position: 'relative' }}>
                          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                            <Typography variant="body2" noWrap title={media.filename}>
                              {media.filename}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {media.type}
                            </Typography>
                            <IconButton
                              size="small"
                              sx={{ position: 'absolute', top: 4, right: 4 }}
                              onClick={() => handleRemoveMedia(media.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submit Buttons */}
          <div className="form-field full-width">
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end', 
              pt: 2,
              borderTop: 1, 
              borderColor: 'divider',
              alignItems: 'center'
            }}>
              
              {/* Form Validation Summary */}
              {(!formData.subject || !formData.description || !formData.location.address || formData.agencies.length === 0) && (
                <Typography variant="body2" color="error" sx={{ mr: 2 }}>
                  * Please fill all required fields
                </Typography>
              )}
              
              {/* Save Draft Button */}
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => {
                  const draftData = {
                    ...formData,
                    status: 'DRAFT' as const,
                    savedAt: new Date().toISOString(),
                    id: `draft_${Date.now()}`
                  };
                  
                  const existingDrafts = JSON.parse(localStorage.getItem('apb_drafts') || '[]');
                  const updatedDrafts = [draftData, ...existingDrafts.slice(0, 4)];
                  
                  localStorage.setItem('apb_drafts', JSON.stringify(updatedDrafts));
                  alert(`Draft saved at ${new Date().toLocaleTimeString()}`);
                }}
                startIcon={<SaveIcon />}
              >
                Save Draft
              </Button>
              
              {/* Cancel Button */}
              <Button 
                variant="text" 
                size="large"
                onClick={() => {
                  const hasUnsavedChanges = formData.subject || formData.description;
                  
                  if (!hasUnsavedChanges || window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                    window.history.back();
                  }
                }}
              >
                Cancel
              </Button>
              
              {/* Preview Button */}
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => {
                  console.log('Preview data:', formData);
                  alert('Preview functionality would show how the APB will look to other officers');
                }}
                disabled={!formData.subject}
                startIcon={<VisibilityIcon />}
              >
                Preview
              </Button>
              
              {/* Publish APB Button */}
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={
                  !formData.subject || 
                  !formData.description || 
                  !formData.location.address || 
                  formData.agencies.length === 0
                }
                startIcon={<PublishIcon />}
                sx={{
                  minWidth: 140,
                  backgroundColor: '#d32f2f',
                  '&:hover': {
                    backgroundColor: '#b71c1c',
                  },
                  '&:disabled': {
                    backgroundColor: '#cccccc',
                  }
                }}
              >
                Publish APB
              </Button>
            </Box>
          </div>
        </div>
      </form>
    </Paper>
  );
};

export default CreateBulletin;