// src/hooks/useVideoUpload.js
import { useRef, useState, useEffect } from 'react';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import axiosInstance from '@utils/axios';  
import config from '@config/config';


const { endpoints } = config;

/**
 * Hook to upload videos directly to BunnyCDN using Uppy + XHRUpload
 * Generates a unique filename using an ISO timestamp prefix.
 * @param {{ zone: string, accessKey: string, onComplete?: (fileName: string) => void }} params
 */
export function useVideoUpload({ zone, accessKey, onComplete }) {
//   console.log("🚀 ~ useVideoUpload ~ onComplete:", onComplete)
//   console.log("🚀 ~ useVideoUpload ~ accessKey:", accessKey)
//   console.log("🚀 ~ useVideoUpload ~ zone:", zone)
  const uppyRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (!zone || !accessKey) {
      setErrorMessage('Configuration error: BunnyCDN keys are missing.');
      return;
    }

    const baseEndpoint = `https://storage.bunnycdn.com/${zone}/uploads/`;
    const uppy = new Uppy({ autoProceed: false })
      .use(XHRUpload, {
        endpoint: baseEndpoint,
        method: 'PUT',
        formData: false,
        headers: { AccessKey: accessKey },
      });
    

    uppy.on('upload', () => {
      setUploading(true);
      setProgress(0);
      setErrorMessage('');
    });

    uppy.on('upload-progress', (_file, data) => {
      setProgress(Math.round((data.bytesUploaded / data.bytesTotal) * 100));
    });

    uppy.on('upload-before-send', (file, xhr) => {
      xhr.setRequestHeader('Content-Type', file.type);
    });

    uppy.on('complete', (result) => {
      setUploading(false);
      // clear files after upload
      uppy.getFiles().forEach(f => uppy.removeFile(f.id));

      if (result.failed.length) {
        const err = result.failed[0].error || {};
        setErrorMessage(`Upload failed: ${err.message || 'Unknown error'}`);
      } else {
        console.log("🚀 ~ uppy.on ~ result:", result)
        const uploadedName = result.successful[0].name;
        setFileName(uploadedName);
        onComplete && onComplete(uploadedName);
      }
    });

    uppy.on('error', (err) => {
      console.error(err);
      setUploading(false);
      setProgress(0);
      // clear any added files
      uppy.getFiles().forEach(f => uppy.removeFile(f.id));
      setErrorMessage(err.message || String(err));
    });

    uppyRef.current = uppy;

    return () => {
      const current = uppyRef.current;
      if (current) {
        current.cancelAll();
        // remove all files to reset
        current.getFiles().forEach(f => current.removeFile(f.id));
      }
      uppyRef.current = null;
    };
  }, []);

  /**
   * Handler for file input change: generates a timestamped filename
   */
  const handleFileSelect = (file) => {
    // const file = e.target.files?.[0];
    if (!file || !uppyRef.current) return;

    // const uppy = uppyRef.current;
    // const plugin = uppy.getPlugin('XHRUpload');

    // // Create a unique filename: timestamp + original name
    // const timestamp = new Date()
    //   .toISOString()
    //   .replace(/[:.]/g, '-')
    //   .replace('T', '_');
    // const uniqueName = `${timestamp}_${file.name}`;

    // plugin.setOptions({
    //   endpoint: `${plugin.opts.endpoint}${encodeURIComponent(uniqueName)}`,
    // });

    // // clear any existing files and add the new one
    // uppy.getFiles().forEach(f => uppy.removeFile(f.id));
    // uppy.addFile({ name: uniqueName, type: file.type, data: file });
    // setErrorMessage('');

    const uppy = uppyRef.current;
    const plugin = uppy.getPlugin('XHRUpload');
    const newFile = new Date().getTime() + '.mp4';
    plugin.setOptions({
      endpoint: `${plugin.opts.endpoint}${encodeURIComponent(newFile)}`
    });
  
    // const newFile = new Date().getTime() + '.mp4';
    // Clear previous and add new file
    uppy.getFiles().forEach(f => uppy.removeFile(f.id));
    const newFilePayload = { name: newFile, type: file.type, data: file };
    uppy.addFile(newFilePayload);
    setErrorMessage('');
  };

  /**
   * Trigger the upload
   */
  const startUpload = async (metadata) => {
    const uppy = uppyRef.current;
    if (!uppy) {
      setErrorMessage('Uploader not initialized.');
      return;
    }
    const filesInfo = uppy.getFiles().map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }));
    if (!uppy.getFiles().length) {
      setErrorMessage('Please select a file first.');
      return;
    }
   try {
      await uppy.upload();
      const uploadedName = fileName || filesInfo[0]?.name;
      const mediaFileUrl = `${process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE}/uploads/${encodeURIComponent(uploadedName)}`;
      // POST metadata
      await axiosInstance.post(endpoints.mediaMetadata, {
        ...metadata,
        mediaFileUrl,
      });
    } catch (err) {
      setErrorMessage(err.message || String(err));
      throw err;
    }
  };

  return { handleFileSelect, startUpload, progress, uploading, errorMessage, fileName };
}


export async function uploadThumbnail(file, zone, accessKey) {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  // generate a timestamped filename
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_');
  const filename = `${timestamp}_${file.name}`;

  const url = `https://storage.bunnycdn.com/${zone}/thumbnails/${encodeURIComponent(filename)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      AccessKey: accessKey,
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Thumbnail upload failed: ${res.status} ${text}`);
  }
  const downloadUrl = `${process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE}/thumbnails/${encodeURIComponent(filename)}`;
  return downloadUrl;
}