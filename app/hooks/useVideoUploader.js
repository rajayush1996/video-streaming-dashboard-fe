// hooks/useVideoUploader.js;
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import config from '@config/config';
import axios from '@utils/axios';

export function useVideoUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadThumbnail = async (file, fileName) => {
    const form = new FormData();
    form.append('fileName', fileName);
    form.append('isThumbnail', 'true');
    form.append('thumbnail', file)

    const res = await axios.post(config.endpoints.upload, form);

    return { file: res?.data?.thumbUrl?.file, url: res?.data?.thumbUrl?.url };
  };

  const uploadVideoInChunks = async (file, fileName, onProgress) => {
    const chunkSize = 5 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);

    const { data } = await axios.get(config.endpoints.uploadProgress, {
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

      const res = await axios.post(config.endpoints.upload, formData);
      if (onProgress) {
        setProgress(Math.round(((i + 1) / totalChunks) * 100));
        onProgress(Math.round(((i + 1) / totalChunks) * 100));
      }
      if(res.data.file) {
        return { file: res?.data?.file, url: res?.data?.url }
      }
    }
  };

  const uploadCompleteVideo = async ({
    title,
    description,
    category,
    thumbnail,
    video,
    onProgress,
    mediaType
  }) => {
    setIsUploading(true);
    setProgress(0);
    
    const fileId = `vid-${Date.now()}`;
    const sanitizedTitle = title.replace(/\s+/g, '_');
    const thumbName = `${fileId}_thumb.jpg`;
    const videoName = `${fileId}_${sanitizedTitle}.mp4`;

    try {
      const thumbNailInfo = await uploadThumbnail(thumbnail, thumbName);
      const videoInfo = await uploadVideoInChunks(video, videoName, onProgress);

      await axios.post(config.endpoints.metadata, {
        title,
        description,
        category,
        mediaFileId: videoInfo?.file?.fileId,
        thumbnailId: thumbNailInfo?.file?.fileId,
        mediaType: mediaType
      });

      toast.success('Video uploaded successfully!');
      setIsUploading(false);
      setProgress(0);
      return { thumbUrl: thumbNailInfo.url, videoUrl: videoInfo.url };
    } catch (err) {
      setIsUploading(false);
      setProgress(0);
      toast.error(err?.response?.data?.error || err.message);
      throw err;
    }
  };

  return {
    uploadCompleteVideo,
    isUploading,
    progress
  };
}
