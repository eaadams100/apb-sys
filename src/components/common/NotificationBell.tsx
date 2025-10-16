import React from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';

const NotificationBell: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationCount, setNotificationCount] = React.useState(3);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setNotificationCount(0); // Mark as read
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const notifications = [
    'New BOLO issued in your area',
    'Missing person report updated',
    'System maintenance scheduled',
  ];

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notificationCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
          },
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <MenuItem key={index} onClick={handleClose}>
              <Typography variant="body2">{notification}</Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">No new notifications</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;