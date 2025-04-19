import { Box, Typography, Avatar, Paper, Divider, Chip } from '@mui/material';
import { useUserProfile } from '@hooks/useUserProfile';
import { Person } from '@mui/icons-material';

export default function Profile() {
  const { data: profile, isLoading, error } = useUserProfile();

  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Error loading profile</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'primary.main',
            fontSize: '2rem',
          }}
        >
          {profile?.firstName?.[0]?.toUpperCase() || <Person />}
        </Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6">
            {profile?.firstName} {profile?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{profile?.username}
          </Typography>
          <Chip
            label={profile?.role}
            color="primary"
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box>
        <Typography variant="body2" color="text.secondary">
          Account Status
        </Typography>
        <Chip
          label={profile?.isActive ? 'Active' : 'Inactive'}
          color={profile?.isActive ? 'success' : 'error'}
          size="small"
          sx={{ mt: 1 }}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Member Since
        </Typography>
        <Typography variant="body1">
          {new Date(profile?.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
    </Paper>
  );
} 