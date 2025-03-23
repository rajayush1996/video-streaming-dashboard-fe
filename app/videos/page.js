'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container } from '@mantine/core';
import VideoTable from '../components/VideoTable';
import VideoForm from '../components/VideoForm';

const videoData = [
  {
    id: '1',
    title: 'Hot Episode 1',
    description: 'First exciting video in the Desibhabhi Nights series.',
    url: 'https://video-cdn.com/ep1',
    thumbnail: 'https://picsum.photos/200',
    category: 'Romance',
  },
  {
    id: '2',
    title: 'Lusty Adventure',
    description: 'An intense scene from Lusty Hub collection.',
    url: 'https://video-cdn.com/ep2',
    thumbnail: 'https://picsum.photos/400',
    category: 'Drama',
  },
];

export default function VideosPage() {
const router = useRouter();

  const [videos, setVideos] = useState([]);
  const [opened, setOpened] = useState(false);

  const handleAdd = (video) => {
    setVideos([...videos, { ...video, id: Date.now() }]);
    setOpened(false);
  };

  const handleDelete = (id) => {
    setVideos(videos.filter((v) => v.id !== id));
  };

  return (
    <Container>
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
      <VideoTable videos={videoData} onDelete={() => {}} onEdit={() => {}} />
    </Container>
  );
}
