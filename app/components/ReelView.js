'use client';

import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as reelApi from '@apis/reel/reelApi';

export default function ReelView({ reel }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: reelApi.deleteReel,
    onSuccess: () => {
      toast.success('Reel deleted successfully');
      queryClient.invalidateQueries(['reels']);
      router.push('/reels');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete reel');
    },
  });

  const handleEdit = () => {
    router.push(`/reels/${reel._id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this reel?')) {
      deleteMutation.mutate(reel._id);
    }
  };

  const handlePlay = () => {
    window.open(reel.reelSpecific?.contentMetadata?.url, '_blank');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {reel.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              label={reel.status} 
              color={reel.status === 'published' ? 'success' : 'default'} 
              size="small" 
            />
            {reel.featured && (
              <Chip label="Featured" color="primary" size="small" />
            )}
          </Stack>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={handleEdit} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1">
          {reel.description}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Duration
        </Typography>
        <Typography variant="body1">
          {reel.reelSpecific?.duration}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Category
        </Typography>
        <Chip 
          label={reel.reelSpecific?.categoryId?.name} 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      {reel.reelSpecific?.thumbnailMetadata && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Thumbnail
          </Typography>
          <Box
            component="img"
            src={reel.reelSpecific.thumbnailMetadata.url}
            alt={reel.title}
            sx={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1,
            }}
          />
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Video Content
        </Typography>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={handlePlay}
        >
          Play Reel
        </Button>
        {reel.reelSpecific?.contentMetadata?.metadata && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Format: {reel.reelSpecific.contentMetadata.metadata.format}
              {' | '}
              Resolution: {reel.reelSpecific.contentMetadata.metadata.width}x{reel.reelSpecific.contentMetadata.metadata.height}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="caption" color="text.secondary">
          Created: {new Date(reel.createdAt).toLocaleString()}
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          Last Updated: {new Date(reel.updatedAt).toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
} 