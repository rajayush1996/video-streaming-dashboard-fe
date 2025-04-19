'use client';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import { IconMenu2, IconLogout } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function HeaderBar({ onMenuClick }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const { data: user, isLoading } = useUserProfile();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/signin');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <IconMenu2 />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Video Streaming Dashboard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLoading ? (
            <Avatar sx={{ width: 32, height: 32 }} />
          ) : (
            <IconButton
              onClick={handleProfileClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            >
              <Avatar 
                sx={{ width: 32, height: 32 }}
                alt={user?.firstName}
                src={user?.avatar}
              />
            </IconButton>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
              <Typography variant="subtitle1">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <IconLogout size={20} style={{ marginRight: 8 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}