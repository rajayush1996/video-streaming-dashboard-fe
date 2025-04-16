// hooks/useVideoUploader.js;
import { showNotification } from '@mantine/notifications';
import config from '@config/config';
import axios from '@utils/axios';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';

export const useVideoUploader = () => {
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
      if (onProgress) onProgress(Math.round(((i + 1) / totalChunks) * 100));
      if(res.data.file) {
        return { file: res?.data?.file, url: res?.data?.url }
      }
    }
    

    // return `https://bunnycdn.example.com/videos/${fileName}`;
  };

  const uploadCompleteVideo = async ({
    title,
    description,
    category,
    thumbnail,
    video,
    onProgress,
  }) => {
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
      });

      showNotification({
        title: 'Success',
        message: 'Video uploaded successfully!',
        color: 'green',
        icon:  <IconCircleCheck size={20} />,
      });

      return { thumbUrl: thumbNailInfo.url, videoUrl: videoInfo.url };
    } catch (err) {
      showNotification({
        title: 'Upload Failed',
        message: err?.response?.data?.error || err.message,
        color: 'red',
        icon: <IconAlertCircle />,
      });
      throw err;
    }
  };

  return { uploadCompleteVideo };
};
