"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
  InputAdornment,
  FormControlLabel,
  Switch,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import PublishIcon from "@mui/icons-material/Publish";
import { useUpdateBlog } from "@hooks/useBlogs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@utils/axios";
import config from "@config/config";

const categories = [
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "education", label: "Education" },
];

export default function BlogEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();

  const { mutate: updateBlog, isLoading } = useUpdateBlog();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    content: "",
    thumbnail: null,
    status: "draft",
  });

  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const blogDataParam = searchParams.get("data");
    if (blogDataParam) {
      try {
        const blogData = JSON.parse(decodeURIComponent(blogDataParam));
        setForm({
          title: blogData.title || "",
          description: blogData.description || "",
          category: blogData.category || "",
          content: blogData.content || "",
          thumbnail: null,
          status: blogData.status || "draft",
        });
        if (blogData.thumbnailUrl) {
          setPreview(blogData.thumbnailUrl);
        }
      } catch (error) {
        toast.error("Failed to load blog data from URL");
      }
    }
  }, [searchParams]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, thumbnail: file });

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.category || !form.content) {
        toast.error("Please fill in all required fields");
        return;
    }
    
    try {
        setIsUploading(true);
        console.log("🚀 ~ handleSubmit ~ form:", form)

          
        const formData = new FormData();
        Object.keys(form).forEach((key) => {
          if (form[key] !== null && form[key] !== undefined) {
            formData.append(key, form[key]);
          }
        });
        
        // console.log("🚀 ~ handleSubmit ~ formData:", formData)
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }
      updateBlog({ id, formData });

      toast.success("Blog updated successfully!");
      router.push("/blogs");
    } catch (error) {
        console.log("🚀 ~ handleSubmit ~ error:", error)
      toast.error(error.message || "Failed to update blog");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublish = async () => {
    if (window.confirm("Are you sure you want to publish this blog?")) {
      try {
        setIsPublishing(true);
        // Direct axios call to publish endpoint
        await axiosInstance.patch(`${config.endpoints.blog}/${id}/publish`);
        toast.success("Blog published successfully!");
        // Update local state to reflect the change
        setForm({ ...form, status: "published" });
      } catch (error) {
        console.error("Publish error:", error);
        toast.error(error.response?.data?.message || "Failed to publish blog");
      } finally {
        setIsPublishing(false);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
        >
          Edit Blog
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="subtitle1">
            Status: 
            <span 
              style={{ 
                marginLeft: '8px',
                padding: '4px 8px', 
                borderRadius: '4px',
                backgroundColor: form.status === 'published' ? '#e6f4ea' : '#fff8e1',
                color: form.status === 'published' ? '#137333' : '#996300',
                fontWeight: 'medium'
              }}
            >
              {form.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </Typography>
          
          {form.status === 'draft' && (
            <Button
              variant="outlined"
              color="success"
              startIcon={<PublishIcon />}
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? 'Publishing...' : 'Publish Now'}
            </Button>
          )}
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={form.title}
                onChange={handleChange("title")}
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={form.description}
                onChange={handleChange("description")}
                required
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
                  onChange={handleChange("category")}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content"
                value={form.content}
                onChange={handleChange("content")}
                required
                multiline
                rows={6}
              />
            </Grid>

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
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <img
                    src={preview}
                    alt="Thumbnail preview"
                    style={{ maxWidth: "100%", maxHeight: 200 }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isUploading || isLoading}
                startIcon={
                  isUploading || isLoading ? (
                    <CircularProgress size={20} />
                  ) : null
                }
              >
                {isUploading || isLoading ? "Updating..." : "Update Blog"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
