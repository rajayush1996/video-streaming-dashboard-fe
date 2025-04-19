'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLogout } from '@/hooks/useAuth';
import { getStoredUserData } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'react-toastify';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const logoutMutation = useLogout();
  const { data: user, isLoading } = useUserProfile();
  const profileRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const userData = getStoredUserData();
    setIsAuthenticated(!!userData);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setAnchorEl(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  // If we're on the signin page, just render the children
  if (pathname === '/signin') {
    return children;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logoutMutation.mutate(); 
    router.push('/signin');
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Videos', icon: <VideoIcon />, path: '/videos' },
    { text: 'Blogs', icon: <ArticleIcon />, path: '/blogs' },
  ];

  const drawer = (
    <div className="relative h-full bg-[#1a1c37]">
      <div className="h-16 flex items-center px-4">
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: 600,
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
            whiteSpace: 'nowrap'
          }}
        >
          Video Dashboard
        </Typography>
      </div>
      
      {/* Navigation Container */}
      <div className="relative">
        {/* Collapse Button */}
        <Box
          sx={{
            position: 'absolute',
            top: '20px',
            right: '-15px',
            width: '30px',
            height: '30px',
            bgcolor: 'rgb(17, 24, 39)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1200,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            '&:hover': {
              bgcolor: 'rgb(31, 41, 55)',
            },
          }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRightIcon sx={{ fontSize: 20, color: 'white' }} />
          ) : (
            <ChevronLeftIcon sx={{ fontSize: 20, color: 'white' }} />
          )}
        </Box>

        {/* Navigation Items */}
        <div className={`px-3 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-full'}`}>
          <List sx={{ mt: 2 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ 
                display: 'block', 
                mb: 2,
                '&:first-of-type': {
                  mt: 1
                }
              }}>
                <ListItemButton
                  selected={pathname === item.path}
                  onClick={() => router.push(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: isCollapsed ? 'center' : 'initial',
                    px: 2.5,
                    borderRadius: '8px',
                    '&.Mui-selected': {
                      bgcolor: 'rgb(37, 99, 235) !important',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{
                      minWidth: 0,
                      mr: isCollapsed ? 0 : 2,
                      justifyContent: 'center',
                      color: pathname === item.path ? 'white' : 'rgb(156, 163, 175)'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{
                      opacity: isCollapsed ? 0 : 1,
                      visibility: isCollapsed ? 'hidden' : 'visible',
                      transition: 'all 0.3s ease-in-out',
                      m: 0,
                      '& .MuiTypography-root': {
                        color: pathname === item.path ? 'white' : 'rgb(156, 163, 175)',
                        fontWeight: pathname === item.path ? 600 : 400,
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${isCollapsed ? '64px' : drawerWidth}px)` },
            ml: { sm: `${isCollapsed ? '64px' : drawerWidth}px` },
            transition: 'all 0.3s ease-in-out',
            backgroundColor: 'rgb(37, 99, 235)',
            boxShadow: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: (theme) => theme.zIndex.drawer + 1
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ 
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'white'
            }}>
              {getPageTitle()}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <div className="relative" ref={profileRef}>
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              >
                <Avatar
                  alt={user?.firstName}
                  src={user?.avatar}
                  sx={{ width: 32, height: 32 }}
                  className="bg-blue-700 hover:bg-blue-600 transition-colors"
                >
                  {user?.firstName?.[0] || 'A'}
                </Avatar>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                backgroundColor: 'rgb(17, 24, 39)', // gray-900
                color: 'white',
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: isCollapsed ? '64px' : drawerWidth,
                transition: 'width 0.3s ease-in-out',
                backgroundColor: 'rgb(17, 24, 39)', // gray-900
                color: 'white',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${isCollapsed ? '64px' : drawerWidth}px)` },
            // ml: { sm: `${isCollapsed ? '64px' : drawerWidth}px` },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Toolbar />
          {children}
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              width: 256,
              maxWidth: '100%',
            },
          }}
        >
          <MenuItem onClick={handleProfileMenuClose}>
            <Avatar
              alt={user?.firstName}
              src={user?.avatar}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Box>
              <Typography variant="body1">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{user?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Joined {new Date(user?.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <Box sx={{ px: 2, py: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Status</Typography>
              <Typography
                variant="body2"
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: user?.isActive ? 'success.light' : 'error.light',
                  color: user?.isActive ? 'success.dark' : 'error.dark',
                }}
              >
                {user?.isActive ? 'Active' : 'Inactive'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Role</Typography>
              <Typography
                variant="body2"
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: 'primary.light',
                  color: 'primary.dark',
                }}
              >
                {user?.role}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Box>
    </div>
  );
}

function getPageTitle() {
  const path = window.location.pathname;
  if (path.includes('/videos')) return 'Videos';
  if (path.includes('/blogs')) return 'Blogs';
  return 'Dashboard';
} 