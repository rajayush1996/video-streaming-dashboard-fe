import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@utils/axios';
import config from '@config/config';
import { toast } from 'react-toastify';
import { toast as hotToast } from 'react-hot-toast';
import * as videosApi from '@apis/videos/videosApi';

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.patch(
        `${config.endpoints.mediaMetadata}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mediaMetadata']);
      toast.success('Video updated successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update video', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(
        `${config.endpoints.mediaMetadata}/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mediaMetadata']);
      toast.success('Video deleted successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete video', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });
};

export const useRestoreVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.post(
        `${config.endpoints.mediaMetadata}/${id}/restore`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mediaMetadata']);
      toast.success('Video restored successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to restore video', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });
};

/**
 * Hook for uploading video chunks
 */
export const useVideoChunkUpload = () => {
  return useMutation({
    mutationFn: ({ chunk, fileName, chunkIndex, totalChunks }) => 
      videosApi.uploadVideoChunk(chunk, fileName, chunkIndex, totalChunks),
    onError: (error) => {
      hotToast.error(error.message || 'Failed to upload video chunk');
    }
  });
};

/**
 * Hook for uploading video thumbnail
 */
export const useVideoThumbnailUpload = () => {
  return useMutation({
    mutationFn: ({ thumbnail, fileName }) => 
      videosApi.uploadThumbnail(thumbnail, fileName),
    onError: (error) => {
      hotToast.error(error.message || 'Failed to upload thumbnail');
    }
  });
};

/**
 * Hook for checking upload progress
 */
export const useCheckUploadProgress = () => {
  return useMutation({
    mutationFn: (fileName) => videosApi.checkUploadProgress(fileName),
    onError: (error) => {
      console.error('Failed to check upload progress:', error);
    }
  });
};

/**
 * Hook for saving video metadata
 */
export const useSaveVideoMetadata = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (metadata) => videosApi.saveVideoMetadata(metadata),
    onSuccess: () => {
      hotToast.success('Video metadata saved successfully!');
      // Invalidate relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
    onError: (error) => {
      hotToast.error(error.message || 'Failed to save video metadata');
    }
  });
};

/**
 * Combined hook for the complete video upload process
 */
export const useCompleteVideoUpload = () => {
  const { mutateAsync: uploadChunk } = useVideoChunkUpload();
  const { mutateAsync: uploadThumbnail } = useVideoThumbnailUpload();
  const { mutateAsync: checkProgress } = useCheckUploadProgress();
  const { mutateAsync: saveMetadata } = useSaveVideoMetadata();
  
  /**
   * Upload a complete video with thumbnail and metadata
   */
  const uploadCompleteVideo = async ({
    videoFile,
    thumbnailFile,
    title,
    description,
    category,
    onProgress
  }) => {
    try {
      // Generate filenames
      const fileId = `vid-${Date.now()}`;
      const sanitizedTitle = title.replace(/\s+/g, '_');
      const thumbName = `${fileId}_thumb.jpg`;
      const videoName = `${fileId}_${sanitizedTitle}.mp4`;
      
      // Upload thumbnail
      const thumbnailResult = await uploadThumbnail({
        thumbnail: thumbnailFile,
        fileName: thumbName
      });
      
      // Check what chunks are already uploaded
      const progressResult = await checkProgress(videoName);
      const uploadedChunks = new Set(progressResult.uploadedChunks || []);
      
      // Calculate chunk size and total chunks
      const chunkSize = 20 * 1024 * 1024; // 20MB chunks
      const totalChunks = Math.ceil(videoFile.size / chunkSize);
      
      // Upload chunks
      let videoResult;
      for (let i = 0; i < totalChunks; i++) {
        if (uploadedChunks.has(i)) continue;
        
        const chunk = videoFile.slice(i * chunkSize, (i + 1) * chunkSize);
        videoResult = await uploadChunk({
          chunk,
          fileName: videoName,
          chunkIndex: i,
          totalChunks
        });
        
        if (onProgress) {
          onProgress(Math.round(((i + 1) / totalChunks) * 100));
        }
        
        if (videoResult?.file) {
          break; // Server indicates upload is complete
        }
      }
      
      // Save metadata
      await saveMetadata({
        title,
        description,
        category,
        mediaFileId: videoResult?.file?.fileId,
        thumbnailId: thumbnailResult?.thumbUrl?.file?.fileId,
      });
      
      return {
        thumbnailUrl: thumbnailResult?.thumbUrl?.url,
        videoUrl: videoResult?.url
      };
    } catch (error) {
      hotToast.error(error.message || 'Video upload failed');
      throw error;
    }
  };
  
  return {
    uploadCompleteVideo
  };
};

/**
 * Hook for uploading a complete reel in one go
 */
export const useReelUpload = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ formData, onProgress }) => 
      videosApi.uploadReel(formData, (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      }),
    onSuccess: () => {
      hotToast.success('Reel uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['reels'] });
    },
    onError: (error) => {
      hotToast.error(error.message || 'Failed to upload reel');
    }
  });
}; 