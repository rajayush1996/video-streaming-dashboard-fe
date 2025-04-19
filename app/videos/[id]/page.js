'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  Chip,
  Stack
} from '@mui/material';
import { IconArrowLeft, IconClock, IconEye } from '@tabler/icons-react';

export default function VideoPlayerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      
      // Try to get video data from URL parameters
      const videoDataParam = searchParams.get('data');
      
      if (videoDataParam) {
        // Parse the video data from the URL
        const videoData = JSON.parse(decodeURIComponent(videoDataParam));
        setVideo(videoData);
        setLoading(false);
      } else {
        // If no data in URL, show error
        setError('Video data not available');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error parsing video data:', err);
      setError('Failed to load video data');
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <Box className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Container>
          <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={48} />
              <Typography variant="h6" color="white">
                Loading video...
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Container>
          <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
            <Box className="bg-red-500/10 p-8 rounded-lg border border-red-500/20">
              <Typography color="error" variant="h6">
                {error}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  if (!video) {
    return (
      <Box className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Container>
          <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
            <Box className="bg-gray-800/50 p-8 rounded-lg border border-gray-700/20">
              <Typography color="text.secondary" variant="h6">
                Video not found
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<IconArrowLeft size={16} />}
          onClick={() => router.back()}
          sx={{ 
            mb: 3,
            color: 'text.secondary',
            '&:hover': { color: 'white' }
          }}
        >
          Back to Videos
        </Button>

        {/* Video Title and Metadata */}
        <Box mb={3}>
          <Typography variant="h4" component="h1" color="white" gutterBottom fontWeight="bold">
            {video.title}
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Chip 
              label={video.category}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Stack direction="row" spacing={2} color="text.secondary">
              <Box display="flex" alignItems="center" gap={0.5}>
                <IconClock size={16} />
                <Typography variant="body2">
                  {video.createdAt || 'Published'}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <IconEye size={16} />
                <Typography variant="body2">
                  {video.views || '0'} views
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {/* Video Player */}
        <Box mb={4}>
          <Box className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <video
              controls
              autoPlay
              className="w-full h-full"
              poster={video.thumbnailUrl}
            >
              <source src={video.mediaFileUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        </Box>

        {/* Description */}
        <Box className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/20">
          <Typography variant="h6" color="white" gutterBottom>
            Description
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {video.description || 'No description available.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}