import { useState } from 'react';
import axios from 'axios';
import axiosInstance from '@utils/axios';
import config from '@config/config';


const { endpoints } = config;

export function useVideoUpload() {
  const [progress, setProgress]   = useState(0);
  const [uploading, setUploading] = useState(false);
  const [videoId, setVideoId]     = useState(null);
  const [error, setError]         = useState(null);

  /**
   * file:         the File object from <input>
   * metadata:     anything you want to POST to your own DB after upload
   */
  const startUpload = async (file, metadata = {}) => {
    setError(null);
    setUploading(true);
    setProgress(0);
    setVideoId(null);

    try {
      // 1) create a slot
      const create = await axios.post(
        '/api/create-video',
        { title: file.name, contentType: file.type }
      );
      const vid = create.data.guid;           // <-- use GUID
      setVideoId(vid);

      // 2) upload binary with progress
      await axios.put(
        `/api/upload-video/${vid}`,
        file,
        {
          headers: { 'Content-Type': file.type },
          onUploadProgress: ev => {
            setProgress(Math.round((ev.loaded * 100) / ev.total));
          }
        }
      );

      // 3) return everything
      const playbackUrl = `https://${process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE}/${vid}/playlist.m3u8`;

			console.log("TCL: startUpload -> playbackUrl", playbackUrl)
        await axiosInstance.post(endpoints.mediaMetadata, {
            ...metadata,
            mediaFileUrl: playbackUrl,
            mediaFileId: vid
            });
      return { videoId: vid, playbackUrl };
    } catch (err) {
      console.log(err);
      setError(err.message || 'Upload error');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { startUpload, progress, uploading, videoId, error };
}
