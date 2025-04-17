'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container, Loader, Center, Text } from '@mantine/core';
import VideoTable from '../components/VideoTable';
import { useMediaMetadata } from '../hooks/useMediaMetadata'; // adjust if needed

export default function VideosPage() {
  const router = useRouter();
  const [opened, setOpened] = useState(false);

  // Pagination / Filters (if needed later)
  const [skip, setSkip] = useState(0);
  const limit = 20;
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 🧠 Hook fetching backend data
  const { data, isLoading, error } = useMediaMetadata({
    skip,
    limit,
    category: selectedCategory,
    searchQuery,
  });

  const handleDelete = (id) => {
    // 🔥 You can connect this to API later
    console.log('Delete', id);
  };

  const handleEdit = (video) => {
    // 🔥 Connect to video edit form
    console.log('Edit', video);
  };

  return (
    <Container>
      {/* Add Button */}
      <div className='mb-[50px]'>
        <Button
          radius="md"
          size="md"
          onClick={() => router.push('/videos/upload')}
          styles={{
            root: {
              backgroundColor: "#334155",
              color: "white",
              fontWeight: 600,
              fontSize: "15px",
              padding: "12px",
              borderRadius: "10px",
              transition: "all 0.2s ease",
              fontFamily: "Poppins, sans-serif",
            },
            rootHovered: {
              backgroundColor: "#60a5fa",
            },
          }}
        >
          Add Video
        </Button>
      </div>

      {/* Table State Handling */}
      {isLoading ? (
        <Center my="xl">
          <Loader color="blue" />
        </Center>
      ) : error ? (
        <Center my="xl">
          <Text color="red">Error loading videos: {error.message}</Text>
        </Center>
      ) : (
        <VideoTable
          videos={data?.results || []}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </Container>
  );
}
