'use client';
import { Box, TextField, MenuItem, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

export default function BlogForm({ onSubmit, initialData = null }) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    thumbnail: null,
    video: null,
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleFileChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const categories = [
    'Romance',
    'Drama',
    'Thriller'
  ];

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Title"
          placeholder="Enter blog title"
          value={form.title}
          onChange={handleChange('title')}
          required
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Content"
          placeholder="Write your blog content..."
          value={form.content}
          onChange={handleChange('content')}
          multiline
          minRows={6}
          fullWidth
          variant="outlined"
        />
        <TextField
          select
          label="Category"
          placeholder="Select category"
          value={form.category}
          onChange={handleChange('category')}
          required
          fullWidth
          variant="outlined"
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
        
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Thumbnail Image
          </Typography>
          <TextField
            type="file"
            onChange={handleFileChange('thumbnail')}
            fullWidth
            variant="outlined"
            inputProps={{ accept: 'image/*' }}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Video File
          </Typography>
          <TextField
            type="file"
            onChange={handleFileChange('video')}
            fullWidth
            variant="outlined"
            inputProps={{ accept: 'video/*' }}
          />
        </Box>

        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          fullWidth
        >
          {initialData ? 'Update Blog' : 'Create Blog'}
        </Button>
      </Stack>
    </Box>
  );
}
