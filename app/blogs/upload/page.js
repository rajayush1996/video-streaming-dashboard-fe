'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import { useCreateBlog } from '@hooks/useBlogs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as blogsApi from '@apis/blogs/blogsApi';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const categories = [
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'education', label: 'Education' },
];

export default function BlogUploadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
    thumbnail: null,
    status: 'draft'
  });
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [publishImmediately, setPublishImmediately] = useState(false);

  const { mutate, isLoading, isError } = useCreateBlog();

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

  const handleStatusChange = (event) => {
    setPublishImmediately(event.target.checked);
    setForm({
      ...form,
      status: event.target.checked ? 'published' : 'draft'
    });
  };

  const handleSubmit = async (e) => {
    try {
    e.preventDefault();
    console.log("🚀 ~ handleSubmit ~ return:");
    // if (!form.title || !form.description || !form.category || !form.content || !form.thumbnail) {
    //   toast.error('Please fill in all fields');
    //   return;
    // }

    console.log("🚀 ~ handleSubmit ~ return:");

    
      setIsUploading(true);
      
      await blogsApi.createBlog(form);
      
      // Reset form
      setForm({
        title: '',
        description: '',
        category: '',
        content: '',
        thumbnail: null,
        
      });
      setPreview(null);
      
      toast.success('Blog created successfully!');
      router.push('/blogs');
    } catch (error) {
      toast.error(error.message || 'Failed to create blog');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Create New Blog
        </Typography>

        <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit}>
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
                Upload Thumbnail
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
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

            {/* Status */}
            <Grid item xs={12} sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={publishImmediately}
                    onChange={handleStatusChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    {publishImmediately ? "Publish immediately" : "Save as draft"}
                  </Typography>
                }
              />
              <Typography variant="caption" color="text.secondary" display="block">
                {publishImmediately 
                  ? "Your blog will be published immediately after creation." 
                  : "Your blog will be saved as a draft and can be published later."}
              </Typography>
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
                onClick={handleSubmit}
              >
                {isLoading || isUploading ? 'Creating...' : 'Create Blog'}
              </Button>
            </Grid>

            {/* Error Message */}
            {isError && (
              <Grid item xs={12}>
                <Alert severity="error">
                  Something went wrong. Please try again.
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
