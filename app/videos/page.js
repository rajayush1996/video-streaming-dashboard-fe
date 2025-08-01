'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Box, Container, Typography } from '@mui/material';
import { useMediaMetadata } from '@hooks/useMediaMetadata';
import { useCategoriesByType } from '@/hooks/useCategories';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  Upload as UploadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import VideoTable from '@/components/VideoTable';
import { useDeleteVideo, useUpdateVideo } from '@/hooks/useVideos';

const ITEMS_PER_PAGE = 6;

export default function VideosPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data, isLoading, isError } = useMediaMetadata({
    page,
    limit: ITEMS_PER_PAGE,
    searchQuery,
    category: selectedCategory,
    type: 'video',
  });

  const { data: categoryResponse } = useCategoriesByType('videos');
  const categories = categoryResponse || [];

  const deleteVideo = useDeleteVideo();
  const updateVideo = useUpdateVideo();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  const handleDelete = async (video) => {
    try {
      await deleteVideo.mutateAsync(video.id);
      toast.success('Video deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete video');
    }
  };

  const handleUpdate = async (updateData) => {
    try {
      await updateVideo.mutateAsync(updateData);
      toast.success('Video updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update video');
    }
  };

  const totalPages = data?.totalPages || 1;

  if (isError) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', color: 'error.main', p: 4, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography>Error loading videos. Please try again later.</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Videos
        </Typography>
        <Link 
          href="/videos/upload" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <UploadIcon sx={{ fontSize: 20 }} />
          Upload Video
        </Link>
      </Box>

      <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <SearchIcon 
              sx={{ 
                position: 'absolute', 
                left: 12, 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'text.secondary',
                fontSize: 20
              }} 
            />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-gray-700/50 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat?.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              {cat?.name}
            </button>
          ))}
        </Box>
      </Box>

      <VideoTable
        videos={data?.results || []}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
        isLoading={isLoading}
        categories={categoryResponse}
      />
    </Container>
  );
}
