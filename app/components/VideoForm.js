'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as videoApi from '@apis/video/videoApi';
import { useCategoriesByType } from '@hooks/useCategories';

export default function VideoForm({ initialData = null, onSuccess }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    thumbnailMetadata: initialData?.videoSpecific?.thumbnailMetadata?._id || '',
    contentMetadata: initialData?.videoSpecific?.contentMetadata?._id || '',
    categoryId: initialData?.videoSpecific?.categoryId?._id || '',
    duration: initialData?.videoSpecific?.duration || '',
    status: initialData?.status || 'draft',
    featured: initialData?.featured || false,
  });

  const [errors, setErrors] = useState({});
  const { data: categories = [] } = useCategoriesByType('videos');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.thumbnailMetadata) {
      newErrors.thumbnailMetadata = 'Thumbnail is required';
    }
    if (!formData.contentMetadata) {
      newErrors.contentMetadata = 'Video content is required';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: videoApi.createVideo,
    onSuccess: (data) => {
      toast.success('Video created successfully');
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create video');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => videoApi.updateVideo(id, data),
    onSuccess: (data) => {
      toast.success('Video updated successfully');
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update video');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (initialData) {
      updateMutation.mutate({ id: initialData._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'featured' ? checked : value,
      // Auto-generate slug from title if title is being changed
      ...(name === 'title' && { slug: value.toLowerCase().replace(/\s+/g, '-') })
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          required
          fullWidth
        />

        <TextField
          label="Slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          fullWidth
          helperText="Auto-generated from title, but can be edited"
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          multiline
          rows={4}
          required
          fullWidth
        />

        <TextField
          label="Thumbnail Media ID"
          name="thumbnailMetadata"
          value={formData.thumbnailMetadata}
          onChange={handleChange}
          error={!!errors.thumbnailMetadata}
          helperText={errors.thumbnailMetadata || "Enter the MediaMeta ID for the thumbnail"}
          required
          fullWidth
        />

        <TextField
          label="Video Content Media ID"
          name="contentMetadata"
          value={formData.contentMetadata}
          onChange={handleChange}
          error={!!errors.contentMetadata}
          helperText={errors.contentMetadata || "Enter the MediaMeta ID for the video content"}
          required
          fullWidth
        />

        <FormControl fullWidth error={!!errors.categoryId}>
          <InputLabel>Category</InputLabel>
          <Select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            label="Category"
            required
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
        </FormControl>

        <TextField
          label="Duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          error={!!errors.duration}
          helperText={errors.duration || "Format: HH:MM:SS"}
          required
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={formData.featured}
              onChange={handleChange}
              name="featured"
            />
          }
          label="Featured Video"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={createMutation.isPending || updateMutation.isPending}
          fullWidth
        >
          {createMutation.isPending || updateMutation.isPending
            ? 'Saving...'
            : initialData
            ? 'Update Video'
            : 'Create Video'}
        </Button>
      </Stack>
    </Box>
  );
}
