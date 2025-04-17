'use client';
import { Image, Text, Badge, Group, Box, ActionIcon, Tooltip, Button } from '@mantine/core';
import { IconTrash, IconPencil, IconPlayerPlay } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function VideoRowList({ videos, onEdit, onDelete }) {
  const router = useRouter();

  if (!videos || videos.length === 0) {
    return (
      <Text align="center" c="dimmed">
        No videos uploaded yet.
      </Text>
    );
  }

  const handlePlay = (video) => {
    // Debug log to check the video data
    console.log('Playing video:', video);
    console.log('Video URL:', video.url);
    
    // Navigate to the video player page with the full video data
    router.push(`/videos/${video.id}?data=${encodeURIComponent(JSON.stringify(video))}`);
  };

  return (
    <Box className="space-y-4">
      {videos.map((video) => {
        
        return (
        <Box
          key={video.id}
          className="flex gap-4 items-start bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all"
        >
          {/* Thumbnail */}
          <Image
            src={video.thumbnailUrl || 'https://via.placeholder.com/160x90?text=No+Image'}
            alt={video.title}
            className='h-[150px] w-[150px] object-cover rounded-md'
            width={160}
            height={90}
            radius="md"
            fit="cover"
          />

          {/* Info */}
          <Box className="flex-1 space-y-1">
            <Text fw={600} size="md">
              {video.title}
            </Text>
            <Text size="sm" c="dimmed" lineClamp={2}>
              {video.description}
            </Text>

            <Group mt="xs" spacing="xs">
              <Badge color="blue" className='p-2' variant="light">
                {video.category}
              </Badge>
              <Badge color="gray" className='p-2' variant="light">
                {video.createdAt || 'Published'}
              </Badge>
            </Group>
            
            {/* Video URL */}
            {/* {video.mediaFileUrl && (
              <Text size="xs" c="dimmed" className="mt-2 truncate">
                URL: {video.mediaFileUrl}
              </Text>
            )} */}
          </Box>

          {/* Icons */}
          <Group spacing="xs" align="start" className="mt-1">
            {video.id && (
              <Tooltip label="Play" withArrow>
                <ActionIcon 
                  color="green" 
                  variant="light" 
                  onClick={() => handlePlay(video)}
                >
                  <IconPlayerPlay size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            <Tooltip label="Edit" withArrow>
              <ActionIcon color="blue" variant="light" onClick={() => onEdit(video.id)}>
                <IconPencil size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete" withArrow>
              <ActionIcon color="red" variant="light" onClick={() => onDelete(video.id)}>
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Box>
      )})}
    </Box>
  );
}
