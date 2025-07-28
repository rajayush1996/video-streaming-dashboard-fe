'use client';

import { useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  Typography
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotifications } from '@/hooks/useNotification';
// import { useNotifications } from '@hooks/useNotifications';

export default function NotificationsMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: notifications = [] } = useNotifications();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen} sx={{ mr: 1 }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="No notifications" />
          </MenuItem>
        ) : (
          notifications.map((n) => (
            <MenuItem key={n.id} divider>
              <ListItemText
                primary={n.message}
                secondary={
                  n.createdAt ? new Date(n.createdAt).toLocaleString() : ''
                }
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}