'use client';
import { Box, TextField, MenuItem, Button, Stack } from '@mui/material';
import { useState } from 'react';

export default function VideoForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
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
          placeholder="Enter video title"
          value={form.title}
          onChange={handleChange('title')}
          required
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Video URL"
          placeholder="https://cdn.com/video.mp4"
          value={form.url}
          onChange={handleChange('url')}
          required
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Description"
          placeholder="Short video description..."
          value={form.description}
          onChange={handleChange('description')}
          multiline
          minRows={3}
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
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          fullWidth
        >
          Submit Video
        </Button>
      </Stack>
    </Box>
  );
}
