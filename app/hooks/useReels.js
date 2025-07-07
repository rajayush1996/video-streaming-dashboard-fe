import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; // Updated import
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { fetchReels, fetchReelById, createReel, updateReel, deleteReel, restoreReel, trackReelView } from '@/api/reelsApi';
import axiosInstance from '@utils/axios';
import config from '@config/config';

// Hook for fetching reels list with pagination, search, and filtering
export const useReels = ({page = 1, limit = 12, search = '', category = ''}) => {
  return useQuery({
    queryKey: ['reels', page, limit, search, category],
    queryFn: () => fetchReels({ page, limit, search, category }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      toast.error(`Failed to fetch reels: ${error.message}`);
    },
  });
};

// Hook for fetching a single reel by ID
export const useReel = (id) => {
  return useQuery({
    queryKey: ['reel', id],
    queryFn: () => fetchReelById(id),
    enabled: !!id,
    onError: (error) => {
      toast.error(`Failed to fetch reel: ${error.message}`);
    },
  });
};

export const useUploadReelChunked = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const router = useRouter();

  const uploadThumbnail = async (file, fileName) => {
    const form = new FormData();
    form.append('fileName', fileName);
    form.append('isThumbnail', 'true');
    form.append('thumbnail', file);
    const res = await axiosInstance.post(config.endpoints.reelsUpload, form);
    return {
      file: res?.data?.thumbUrl?.file,
      url: res?.data?.thumbUrl?.url,
    };
  };

  const uploadVideoInChunks = async (file, fileName, onProgress) => {
    const chunkSize = 5 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);

    const { data } = await axiosInstance.get(config.endpoints.uploadProgress, {
      params: { fileName },
    });
    const uploadedChunks = new Set(data.uploadedChunks || []);

    for (let i = 0; i < totalChunks; i++) {
      if (uploadedChunks.has(i)) continue;

      const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
      const formData = new FormData();
      formData.append('fileName', fileName);
      formData.append('chunkIndex', i.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('chunk', chunk);

      const res = await axiosInstance.post(config.endpoints.upload, formData);

      const percent = Math.round(((i + 1) / totalChunks) * 100);
      setProgress(percent);
      if (onProgress) onProgress(percent);

      if (res.data.file) {
        return { file: res.data.file, url: res.data.url };
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async ({ title, description, category, tags, video, thumbnail, onProgress }) => {
      setIsUploading(true);
      setProgress(0);
      const fileId = `reel-${Date.now()}`;
      const sanitizedTitle = title.replace(/\s+/g, '_');
      const thumbName = `${fileId}_thumb.jpg`;
      const videoName = `${fileId}_${sanitizedTitle}.mp4`;
      let thumbInfo;
      if(thumbnail){
        thumbInfo = await uploadThumbnail(thumbnail, thumbName);
      }
      const videoInfo = await uploadVideoInChunks(video, videoName, onProgress);

      await axiosInstance.post(config.endpoints.metadata, {
        title,
        description,
        category,
        tags,
        mediaFileId: videoInfo?.file?.fileId,
        thumbnailId: thumbInfo && thumbInfo?.file?.fileId,
        mediaType: 'reel',
      });

      return {
        thumbUrl: thumbInfo?.url,
        videoUrl: videoInfo.url,
      };
    },
    onSuccess: () => {
      toast.success('Reel uploaded successfully!');
      queryClient.invalidateQueries(['reels']);
      router.push('/reels');
      setIsUploading(false);
      setProgress(0);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || 'Failed to upload reel');
      setIsUploading(false);
      setProgress(0);
    },
  });

  return {
    uploadReel: mutation.mutate,
    isUploading,
    progress,
  };
};

// Hook for updating an existing reel
export const useUpdateReel = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, formData }) => updateReel(id, formData),
    onSuccess: (_, variables) => {
      toast.success('Reel updated successfully!');
      queryClient.invalidateQueries(['reels']);
      queryClient.invalidateQueries(['reel', variables.id]);
      router.push(`/reels/${variables.id}`);
    },
    onError: (error) => {
      toast.error(`Failed to update reel: ${error.message}`);
    },
  });
};

// Hook for deleting a reel
export const useDeleteReel = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteReel(id),
    onSuccess: () => {
      toast.success('Reel deleted successfully!');
      queryClient.invalidateQueries(['reels']);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to delete reel: ${error.message}`);
    },
  });
};

// Hook for restoring a deleted reel
export const useRestoreReel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => restoreReel(id),
    onSuccess: () => {
      toast.success('Reel restored successfully!');
      queryClient.invalidateQueries(['reels']);
    },
    onError: (error) => {
      toast.error(`Failed to restore reel: ${error.message}`);
    },
  });
};

// Hook for tracking reel view progress (analytics)
export const useReelProgress = (id) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTimeUpdate = (e) => {
    const video = e.target;
    const percentage = (video.currentTime / video.duration) * 100;
    setProgress(percentage);

    if (percentage > 10 && id) {
      trackReelView(id).catch(console.error);
    }
  };

  const togglePlay = (videoElement) => {
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement.play();
      setIsPlaying(true);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  };

  return {
    progress,
    isPlaying,
    handleTimeUpdate,
    togglePlay,
  };
};