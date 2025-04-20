"use client";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Box, Typography, Divider, useTheme, useMediaQuery } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { IconHome, IconVideo, IconBook, IconSettings, IconUsers, IconLogout, IconMovie } from '@tabler/icons-react';
import { useState, useEffect } from 'react';

const menuItems = [
  { icon: IconHome, label: 'Dashboard', path: '/dashboard' },
  { icon: IconVideo, label: 'Video Management', path: '/videos' },
  { icon: IconMovie, label: 'Reels', path: '/reels' },
  { icon: IconBook, label: 'Blog Management', path: '/blogs' },
  { icon: IconUsers, label: 'User Management', path: '/users' },
  { icon: IconSettings, label: 'Settings', path: '/settings' },
];

export default function SideBar({ open, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const drawerWidth = 280;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/signin');
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
          Video Streaming
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  router.push(item.path);
                  if (isMobile) onClose();
                }}
                sx={{
                  py: 1.5,
                  px: 3,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.12)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Icon 
                    size={20} 
                    color={isActive ? theme.palette.primary.main : theme.palette.text.secondary} 
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ my: 1 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 3,
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <IconLogout size={20} color={theme.palette.error.main} />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: 500,
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  if (!mounted) return null;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
}
