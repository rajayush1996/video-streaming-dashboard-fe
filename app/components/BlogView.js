'use client';

import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as blogApi from '@apis/blog/blogApi';

export default function BlogView({ blog }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: blogApi.deleteBlog,
    onSuccess: () => {
      toast.success('Blog deleted successfully');
      queryClient.invalidateQueries(['blogs']);
      router.push('/blogs');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete blog');
    },
  });

  const handleEdit = () => {
    router.push(`/blogs/${blog._id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteMutation.mutate(blog._id);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {blog.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              label={blog.status} 
              color={blog.status === 'published' ? 'success' : 'default'} 
              size="small" 
            />
            {blog.featured && (
              <Chip label="Featured" color="primary" size="small" />
            )}
          </Stack>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={handleEdit} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1">
          {blog.description}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Excerpt
        </Typography>
        <Typography variant="body1">
          {blog.blogSpecific?.excerpt}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Read Time
        </Typography>
        <Typography variant="body1">
          {blog.blogSpecific?.readTime}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Category
        </Typography>
        <Chip 
          label={blog.blogSpecific?.categoryId?.name} 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      {blog.blogSpecific?.thumbnailMetadata && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Thumbnail
          </Typography>
          <Box
            component="img"
            src={blog.blogSpecific.thumbnailMetadata.url}
            alt={blog.title}
            sx={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1,
            }}
          />
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Content
        </Typography>
        {blog.blogSpecific?.contentMetadata?.type === 'pdf' ? (
          <Button
            variant="outlined"
            href={blog.blogSpecific.contentMetadata.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View PDF Content
          </Button>
        ) : (
          <Typography variant="body1">
            {blog.blogSpecific?.contentMetadata?.url}
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="caption" color="text.secondary">
          Created: {new Date(blog.createdAt).toLocaleString()}
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          Last Updated: {new Date(blog.updatedAt).toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
} 