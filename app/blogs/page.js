"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
  Pagination,
  Stack,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useBlogs } from '@hooks/useBlogs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 6;

export default function BlogsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data, isLoading, isError } = useBlogs({
    skip: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
    searchQuery,
    category: selectedCategory,
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1); // Reset to first page on category change
  };

  const handleEdit = (id) => {
    router.push(`/blogs/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        // Implement delete functionality
        toast.success('Blog deleted successfully');
      } catch (error) {
        toast.error('Failed to delete blog');
      }
    }
  };

  const categories = [
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'education', label: 'Education' },
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container>
        <Alert severity="error">Failed to load blogs. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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
          <Stack direction="row" spacing={1}>
            <Chip
              label="All"
              onClick={() => handleCategoryChange('')}
              color={selectedCategory === '' ? 'primary' : 'default'}
            />
            {categories.map((category) => (
              <Chip
                key={category.value}
                label={category.label}
                onClick={() => handleCategoryChange(category.value)}
                color={selectedCategory === category.value ? 'primary' : 'default'}
              />
            ))}
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {data?.blogs?.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={blog.thumbnailUrl}
                  alt={blog.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {blog.description}
                  </Typography>
                  <Chip
                    label={blog.category}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Box display="flex" justifyContent="space-between" mt="auto">
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(blog._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(blog._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {data?.total > ITEMS_PER_PAGE && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={Math.ceil(data.total / ITEMS_PER_PAGE)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
}
