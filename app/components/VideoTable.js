"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  Stack,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function VideoRowList({ 
  videos, 
  onDelete, 
  onUpdate,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  isLoading = false
}) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const openEditModal = (video) => {
    setCurrentVideo(video);
    setTitle(video.title);
    setDescription(video.description);
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    if (currentVideo) {
      await onUpdate({
        id: currentVideo.id,
        data: {
          title,
          description
        }
      });
    }
    setEditModalOpen(false);
  };

  const handlePlay = (video) => {
    router.push(`/videos/${video.id}?data=${encodeURIComponent(JSON.stringify(video))}`);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography>Loading videos...</Typography>
      </Box>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <Typography align="center" color="text.secondary">
        No videos uploaded yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {videos.map((video) => (
        <Box
          key={video.id}
          sx={{
            display: 'flex',
            gap: 3,
            alignItems: 'flex-start',
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease-in-out'
            }
          }}
        >
          {/* Thumbnail */}
          <Box
            sx={{
              position: 'relative',
              minWidth: 180,
              height: 120,
              borderRadius: 1,
              overflow: 'hidden',
              bgcolor: 'rgba(0, 0, 0, 0.1)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {video.thumbnailUrl ? (
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                width={180}
                height={120}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
                unoptimized
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary'
                }}
              >
                <Typography variant="caption">No thumbnail</Typography>
              </Box>
            )}
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {video.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 2,
                lineHeight: 1.5
              }}
            >
              {video.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography
                variant="caption"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: '16px',
                  display: 'inline-block',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap'
                }}
              >
                {video.category}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  bgcolor: 'grey.700',
                  color: 'white',
                  borderRadius: '16px',
                  display: 'inline-block',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap'
                }}
              >
                {video.createdAt || "Published"}
              </Typography>
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
            {video.id && (
              <Tooltip title="Play">
                <IconButton
                  color="success"
                  size="medium"
                  sx={{
                    bgcolor: 'success.light',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'success.main',
                    }
                  }}
                  onClick={() => handlePlay(video)}
                >
                  <PlayArrowIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                size="medium"
                sx={{
                  bgcolor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  }
                }}
                onClick={() => openEditModal(video)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                size="medium"
                sx={{
                  bgcolor: 'error.light',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'error.main',
                  }
                }}
                onClick={() => onDelete(video)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => onPageChange(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Edit Dialog */}
      {currentVideo && (
        <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ borderRadius: '25px'}}
      >
        <DialogTitle>Edit Video</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { color: '#e0e0e0' } }}
              InputProps={{
                style: {
                  color: '#fff',
                  borderColor: '#555',
                  backgroundColor: '#1e1e1e',
                },
              }}
              sx={{ mt: 1}}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              InputLabelProps={{ style: { color: '#e0e0e0' } }}
              InputProps={{
                style: {
                  color: '#fff',
                  borderColor: '#555',
                  backgroundColor: '#1e1e1e',
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} sx={{ color: '#2196f3' }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      )}
    </Box>
  );
}
