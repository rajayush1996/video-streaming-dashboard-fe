"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, Typography, Paper, Alert, LinearProgress } from "@mui/material";
import BlogForm from "@/components/BlogForm";
import { useCreateBlog } from "@hooks/useBlogs";

export default function CreateBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const createBlogMutation = useCreateBlog();

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Format data for API
      const blogData = new FormData();
      blogData.append("title", formData.title);
      blogData.append("content", formData.content);
      blogData.append("category", formData.category);
      
      if (formData.thumbnail) {
        blogData.append("thumbnail", formData.thumbnail);
      }
      
      if (formData.video) {
        blogData.append("video", formData.video);
      }
      
      // Call mutation to create blog
      await createBlogMutation.mutateAsync(blogData);
      
      // Redirect to blogs list after successful creation
      router.push("/blogs");
    } catch (err) {
      setError(err.message || "Failed to create blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Blog
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fill in the details below to create a new blog post
          </Typography>
        </Box>

        {isSubmitting && <LinearProgress sx={{ mb: 3 }} />}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <BlogForm onSubmit={handleSubmit} />
      </Paper>
    </Container>
  );
} 