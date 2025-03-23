'use client';
import { Image, Text, Badge, Group, Box, ActionIcon, Tooltip } from '@mantine/core';
import { IconTrash, IconPencil } from '@tabler/icons-react';

export default function VideoRowList({ videos, onEdit, onDelete }) {
  if (!videos || videos.length === 0) {
    return (
      <Text align="center" c="dimmed">
        No videos uploaded yet.
      </Text>
    );
  }

  return (
    <Box className="space-y-4">
      {videos.map((video) => (
        <Box
          key={video.id}
          className="flex gap-4 items-start bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all"
        >
          {/* Thumbnail */}
          <Image
            src={video.thumbnail || 'https://via.placeholder.com/160x90?text=No+Image'}
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
                {video.status || 'Published'}
              </Badge>
            </Group>
          </Box>

          {/* Icons */}
          <Group spacing="xs" align="start" className="mt-1">
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
      ))}
    </Box>
  );
}
