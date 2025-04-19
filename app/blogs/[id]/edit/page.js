'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import { useUpdateBlog } from '@hooks/useBlogs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categories = [
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'education', label: 'Education' },
];

export default function BlogEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
    thumbnail: null,
  });
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: updateBlog, isLoading } = useUpdateBlog();

  useEffect(() => {
    // Fetch blog data
    const fetchBlog = async () => {
      try {
        // Implement fetch blog functionality
        const blogData = {
          title: 'Sample Blog',
          description: 'Sample Description',
          category: 'technology',
          content: 'Sample Content',
          thumbnailUrl: 'https://example.com/image.jpg',
        };
        setForm({
          title: blogData.title,
          description: blogData.description,
          category: blogData.category,
          content: blogData.content,
          thumbnail: null,
        });
        setPreview(blogData.thumbnailUrl);
      } catch (error) {
        toast.error('Failed to load blog data');
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, thumbnail: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title || !form.description || !form.category || !form.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      await updateBlog({ id, formData });
      
      toast.success('Blog updated successfully!');
      router.push('/blogs');
    } catch (error) {
      toast.error(error.message || 'Failed to update blog');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Edit Blog
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={form.title}
                onChange={handleChange('title')}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={form.description}
                onChange={handleChange('description')}
                required
                multiline
                rows={3}
                variant="outlined"
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
                  onChange={handleChange('category')}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Content */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content"
                value={form.content}
                onChange={handleChange('content')}
                required
                multiline
                rows={6}
                variant="outlined"
              />
            </Grid>

            {/* Thumbnail Upload */}
            <Grid item xs={12}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Upload New Thumbnail
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
              {preview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={preview}
                    alt="Thumbnail preview"
                    style={{ maxWidth: '100%', maxHeight: 200 }}
                  />
                </Box>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isLoading || isUploading}
                startIcon={isLoading || isUploading ? <CircularProgress size={20} /> : null}
              >
                {isLoading || isUploading ? 'Updating...' : 'Update Blog'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
} 