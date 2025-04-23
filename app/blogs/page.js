'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useBlogs } from '@/hooks/useBlogs';
import { useCategoriesByType } from '@/hooks/useCategories';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 6;

export default function BlogsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: blogsData, isLoading, isError } = useBlogs({
    page,
    limit: ITEMS_PER_PAGE,
    searchQuery,
    category: selectedCategory,
  });

  const { data: categories = [] } = useCategoriesByType('blogs');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Blogs
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => router.push('/blogs/upload')}
          >
            Create Blog
          </Button>
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box mb={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" minHeight="40vh">
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">Failed to load blogs.</Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {blogsData?.results?.map((blog) => (
                <Grid item xs={12} sm={6} md={4} key={blog._id}>
                  <Box
                    p={2}
                    sx={{
                      bgcolor: '#1e293b',
                      color: 'white',
                      borderRadius: 2,
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Typography variant="h6" gutterBottom noWrap>
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="gray">
                      {blog.description || 'No description'}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="center" mt={4}>
              {blogsData?.totalPages > 0 && (
                <Pagination
                  count={blogsData.totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              )}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}