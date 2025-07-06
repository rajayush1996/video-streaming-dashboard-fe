'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Pagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Stack,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-hot-toast';
import { useDeleteReel } from '@hooks/useReels';
import DashboardLayout from '@/components/DashboardLayout';
import NoData from '@/components/NoData';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useCategoriesByType } from '@/hooks/useCategories';
import { useMediaMetadata } from '@/hooks/useMediaMetadata';

const ITEMS_PER_PAGE = 12;

function ReelsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');

  const { data: response, isLoading } = useMediaMetadata({
    page,
    limit,
    searchQuery: search,
    category,
    type: 'reel',
  });

  const { data: categories = [] } = useCategoriesByType('reels');
  const deleteReelMutation = useDeleteReel();
  const data = response;

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handlePageChange = (_, value) => setPage(value);
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleAddReel = () => router.push('/reels/upload');
  const handleEditReel = (id) => router.push(`/reels/edit/${id}`);
  const handleViewReel = (id) => router.push(`/reels/${id}`);

  const handleDeleteReel = (id) => {
    if (window.confirm('Are you sure you want to delete this reel?')) {
      deleteReelMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Reel deleted successfully');
          location.reload(); // you can replace with refetch() if available
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to delete reel');
        },
      });
    }
  };

  const renderReels = () => {
    if (!data?.results?.length) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            textAlign: 'center',
          }}
        >
          <NoData message="No reels found" />
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {data.results.map((reel) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={reel.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: 3,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="div"
                sx={{ position: 'relative', pt: '177.78%', cursor: 'pointer' }}
                onClick={() => handleViewReel(reel.id)}
              >
                <Box
                  component="img"
                  src={reel.thumbnailUrl || reel.mediaFileUrl}
                  alt={reel.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1, px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="600" noWrap>
                  {reel.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {reel.views || 0} views
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 1 }}>
                <IconButton size="small" onClick={() => handleViewReel(reel.id)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleEditReel(reel.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteReel(reel.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Reels
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddReel}>
            Upload Reel
          </Button>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search reels..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch} edge="end">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select value={category} label="Category" onChange={handleCategoryChange}>
                <MenuItem value="">All Categories</MenuItem>
                {categories?.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Items per page</InputLabel>
              <Select
                value={limit}
                label="Items per page"
                onChange={(e) => {
                  setLimit(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={24}>24</MenuItem>
                <MenuItem value={48}>48</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Grid or Loading */}
        {isLoading ? (
          <LoadingSkeleton count={limit} height={300} />
        ) : (
          renderReels()
        )}

        {/* Pagination */}
        {data && data.totalPages > 0 && (
          <Stack alignItems="center" sx={{ mt: 4 }}>
            <Pagination
              count={data.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Stack>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default ReelsPage;
