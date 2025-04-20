"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PublishIcon from "@mui/icons-material/Publish";
import { useBlogs } from "@hooks/useBlogs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@utils/axios";
import config from "@config/config";
import { useQueryClient } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 6;

export default function BlogsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useBlogs({
    page,
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

  const handleEdit = (blog) => {
    const encodedData = encodeURIComponent(JSON.stringify(blog));
    router.push(`/blogs/${blog._id}/edit?data=${encodedData}`);
  };
  

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        // Implement delete functionality
        toast.success("Blog deleted successfully");
      } catch (error) {
        toast.error("Failed to delete blog");
      }
    }
  };

  const handlePublish = async (id) => {
    if (window.confirm("Are you sure you want to publish this blog?")) {
      try {
        // Use axios directly instead of hooks
        await axiosInstance.patch(`${config.endpoints.blog}/${id}/publish`);
        
        // Refresh data by refetching
        await queryClient.invalidateQueries({ queryKey: ['blogs'] });
        
        toast.success("Blog published successfully");
      } catch (error) {
        console.error("Publish error:", error);
        toast.error(error.response?.data?.message || "Failed to publish blog");
      }
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const categories = [
    { value: "technology", label: "Technology" },
    { value: "business", label: "Business" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "education", label: "Education" },
  ];

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container>
        <Alert severity="error">
          Failed to load blogs. Please try again later.
        </Alert>
      </Container>
    );
  }

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
            onClick={() => router.push("/blogs/upload")}
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
              onClick={() => handleCategoryChange("")}
              color={selectedCategory === "" ? "primary" : "default"}
            />
            {categories.map((category) => (
              <Chip
                key={category.value}
                label={category.label}
                onClick={() => handleCategoryChange(category.value)}
                color={
                  selectedCategory === category.value ? "primary" : "default"
                }
              />
            ))}
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {data?.results?.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "#1e293b",
                  color: "white",
                  borderRadius: 2,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                  p: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {blog.thumbnailUrl && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={blog.thumbnailUrl}
                    alt={blog.title}
                    sx={{ objectFit: "cover", borderRadius: 1, mb: 2 }}
                  />
                )}

                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 0,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    noWrap
                  >
                    {blog.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="gray"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      mb: 1,
                    }}
                  >
                    {blog.description || "No description available."}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    {blog.category && (
                      <Chip
                        label={blog.category}
                        size="small"
                        color="primary"
                      />
                    )}
                    <Chip
                      label={blog.status}
                      size="small"
                      variant="outlined"
                      color={blog.status === "draft" ? "warning" : "success"}
                    />
                  </Stack>

                  <Box mb={2}>
                    <Typography variant="caption" color="gray" display="block">
                      <strong>Issued on:</strong>{" "}
                      {new Date(blog.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="gray" display="block">
                      <strong>Last modified:</strong>{" "}
                      {new Date(blog.updatedAt).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box mt="auto" display="flex" justifyContent="space-between">
                    {blog.status === 'draft' && (
                      <Button
                        size="small"
                        color="success"
                        startIcon={<PublishIcon />}
                        onClick={() => handlePublish(blog._id)}
                      >
                        Publish
                      </Button>
                    )}
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(blog)}
                      sx={{ color: "#90caf9" }}
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

        <Box display="flex" justifyContent="center" mt={4}>
          {data?.totalPages > 0 && (
            <Pagination 
              count={data.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
}
