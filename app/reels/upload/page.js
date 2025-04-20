'use client';

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useUploadReelChunked } from '@/hooks/useReels';

const ReelUploadPage = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const { uploadReel, isUploading, progress } = useUploadReelChunked();

  const handleBack = () => router.push('/reels');

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formValues.tags.includes(tag)) {
      setFormValues((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormValues((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (MP4, MOV, AVI, WMV)');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video must be under 100MB');
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, WEBP, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Thumbnail must be under 5MB');
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, category } = formValues;
    if (!title.trim()) return toast.error('Title is required');
    if (!category) return toast.error('Category is required');
    if (!videoFile) return toast.error('Video file is required');
    if (!thumbnailFile) return toast.error('Thumbnail image is required');

    uploadReel({
      ...formValues,
      video: videoFile,
      thumbnail: thumbnailFile,
      onProgress: (p) => console.log('Uploading...', p),
    });
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Reels
        </Button>

        <Typography variant="h4" sx={{ mb: 4 }}>
          Upload New Reel
        </Typography>

        <Paper elevation={3} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Upload Section */}
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Video Upload */}
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Upload Video
                  </Typography>
                  {!videoPreview ? (
                    <Box
                      sx={{
                        border: '2px dashed #ccc',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { borderColor: 'primary.main' },
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        accept="video/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleVideoChange}
                      />
                      <CloudUploadIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography>Click or drag your reel here</Typography>
                      <Typography variant="caption" display="block" mt={1}>
                        Formats: MP4, MOV, AVI, WMV (Max 100MB)
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <video src={videoPreview} controls style={{ width: '100%', borderRadius: 8 }} />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                        }}
                        onClick={() => {
                          setVideoFile(null);
                          setVideoPreview('');
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  )}

                  {/* Thumbnail Upload */}
                  <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    Upload Thumbnail
                  </Typography>
                  <Box
                    sx={{
                      border: '2px dashed #ccc',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = handleThumbnailChange;
                      input.click();
                    }}
                  >
                    {thumbnailPreview ? (
                      <>
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail"
                          style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setThumbnailFile(null);
                            setThumbnailPreview('');
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography>Click to upload thumbnail</Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Grid>

              {/* Form Fields */}
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <TextField
                    label="Title"
                    name="title"
                    value={formValues.title}
                    onChange={handleFormChange}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Description"
                    name="description"
                    value={formValues.description}
                    onChange={handleFormChange}
                    multiline
                    rows={4}
                    fullWidth
                  />
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formValues.category}
                      onChange={handleFormChange}
                    >
                      {['entertainment', 'education', 'sports', 'lifestyle', 'food', 'travel', 'other'].map(
                        (cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>

                  <Box>
                    <Box display="flex" gap={1} mb={1}>
                      <TextField
                        label="Add Tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        fullWidth
                        size="small"
                      />
                      <Button onClick={handleAddTag} disabled={!tagInput.trim()}>
                        Add
                      </Button>
                    </Box>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {formValues.tags.map((tag) => (
                        <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />
                      ))}
                    </Box>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Uploading... {progress}%
                      </>
                    ) : (
                      'Upload Reel'
                    )}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default ReelUploadPage;
