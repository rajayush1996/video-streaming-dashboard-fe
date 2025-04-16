'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Container, Title, Text, Button, Loader, Center, Group, Badge } from '@mantine/core';
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
        console.log('Video data:', videoData); // Debug log
        console.log('Video URL:', videoData.url); // Debug log for URL
        console.log('Video thumbnail:', videoData.thumbnail); // Debug log for thumbnail
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Container>
          <Center className="h-screen">
            <div className="flex flex-col items-center space-y-4">
              <Loader size="xl" color="white" />
              <Text className="text-white text-lg">Loading video...</Text>
            </div>
          </Center>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Container>
          <Center className="h-screen">
            <div className="bg-red-500/10 p-8 rounded-lg border border-red-500/20">
              <Text className="text-red-400 text-lg">{error}</Text>
            </div>
          </Center>
        </Container>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Container>
          <Center className="h-screen">
            <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700/20">
              <Text className="text-gray-400 text-lg">Video not found</Text>
            </div>
          </Center>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Container size="lg" className="py-8">
        {/* Back Button */}
        <Button
          leftIcon={<IconArrowLeft size={16} />}
          variant="subtle"
          onClick={() => router.back()}
          className="mb-6 text-gray-400 hover:text-white transition-colors duration-200"
        >
          Back to Videos
        </Button>

        {/* Video Title and Metadata */}
        <div className="mb-6">
          <Title order={1} className="text-white mb-4 text-3xl font-bold">
            {video.title}
          </Title>
          
          <Group className="mb-4">
            <Badge 
              color="blue" 
              size="lg"
              className="bg-blue-500/20 text-blue-400 border-blue-500/30"
            >
              {video.category}
            </Badge>
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-1">
                <IconClock size={16} />
                <Text size="sm">{video.createdAt || 'Published'}</Text>
              </div>
              <div className="flex items-center space-x-1">
                <IconEye size={16} />
                <Text size="sm">{video.views || '0'} views</Text>
              </div>
            </div>
          </Group>
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <video
              controls
              autoPlay
              className="w-full h-full"
              poster={video.thumbnail}
            >
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/20">
          <Title order={3} className="text-white mb-3">
            Description
          </Title>
          <Text className="text-gray-400 leading-relaxed">
            {video.description || 'No description available.'}
          </Text>
        </div>
      </Container>
    </div>
  );
}