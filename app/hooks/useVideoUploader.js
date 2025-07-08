// hooks/useVideoUploader.js
import axiosInstance from '@utils/axios';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import config from '@config/config';

// const API_BASE_URL = 'http://localhost:5000';
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

const endpoints = config.endpoints;
export function useVideoUploader() {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const uploadAbortController = useRef(null);

    /**
     * Uploads a single image file (e.g., thumbnail) to the backend.
     * This uses a standard FormData approach for image files.
     * @param {File} file - The image File object.
     * @param {string} fileName - Desired name for the file on the server/CDN.
     * @param {'thumbnail' | 'image'} mediaType - To indicate the type of image for backend routing/storage.
     * @returns {Promise<string>} The public URL of the uploaded image.
     */
    const uploadImage = async (file, fileName, mediaType) => {
        if (!file) return null; // No file provided

        const formData = new FormData();
        formData.append('file', file); // 'file' should match what your express-fileupload expects
        formData.append('fileName', fileName);
        formData.append('mediaType', mediaType);

        try {
            const response = await axiosInstance.post(endpoints.uploadImage, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Crucial for FormData
                },
                signal: uploadAbortController.current?.signal, // Allow cancellation
            });
            console.log(`Image uploaded successfully: ${response.data.file}`);
            return response.data; // Assuming backend returns { fileUrl: '...' }
          } catch (error) {
            console.error(`Failed to upload image ${fileName}:`, error);
            throw new Error(`Image upload failed: ${error.message}`);
        }
    };


    const uploadCompleteVideo = async ({
        title,
        description,
        category,
        thumbnail,
        video,
        onProgress,
        mediaType,
    }) => {
        setIsUploading(true);
        setProgress(0);
        let uploadId = null;

        uploadAbortController.current = new AbortController();
        const { signal } = uploadAbortController.current;

        try {
            if (!video) {
                throw new Error('Video file is required for upload.');
            }

            const fileId = `vid-${Date.now()}`;
            const sanitizedTitle = title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
            const videoFileName = `${fileId}_${sanitizedTitle}.mp4`;

            let thumbnailDetails = null; // Will store the final public URL of the thumbnail

            // --- Handle Thumbnail Upload ---
            if (thumbnail) {
                try {
                    const fileExtension = thumbnail.name.split('.').pop();
                    const thumbnailFileName = `${fileId}_thumb.${fileExtension}`
                    thumbnailDetails = await uploadImage(thumbnail, thumbnailFileName, 'thumbnail');

                    toast.success('Thumbnail uploaded successfully!');
                } catch (thumbError) {
                    console.warn('Thumbnail upload failed:', thumbError);
                    toast.warn('Thumbnail upload failed, proceeding without it.');
                    thumbnailDetails = null; // Ensure it's null if upload failed
                }
            }

            // --- Initiate Video Upload with backend ---
            const totalChunks = Math.ceil(video.size / CHUNK_SIZE);
            const initiateResponse = await axiosInstance.post(endpoints.uploadInitiate, {
                fileName: videoFileName,
                totalChunks: totalChunks,
                fileSize: video.size,
            }, { signal });

            uploadId = initiateResponse.data.uploadId;
            console.log(`Video upload initiated with ID: ${uploadId}`);
            toast.info(`Starting video upload...`);

            // --- Check for existing chunks for resumption ---
            let existingUploadedChunks = new Set();
            try {
                const statusResponse = await axiosInstance.get(`${endpoints.uploadStatus}/${uploadId}`, { signal });
                existingUploadedChunks = new Set(statusResponse.data.uploadedChunks);
                if (existingUploadedChunks.size > 0) {
                    toast.info(`Resuming upload. ${existingUploadedChunks.size} chunks already uploaded.`);
                }
            } catch (statusError) {
                console.warn("Could not fetch existing video upload status (might be a new upload or old ID):", statusError.message);
            }

            // --- Upload Video Chunks ---
            let chunksUploadedCount = existingUploadedChunks.size;
            for (let i = 0; i < totalChunks; i++) {
                if (signal.aborted) {
                    throw new Error('Upload aborted by user.');
                }

                if (existingUploadedChunks.has(i)) {
                    console.log(`Chunk ${i} already uploaded. Skipping.`);
                    const currentProgress = Math.round(((chunksUploadedCount) / totalChunks) * 100);
                    setProgress(currentProgress);
                    if (onProgress) onProgress(currentProgress);
                    continue;
                }

                const start = i * CHUNK_SIZE;
                const end = Math.min(video.size, start + CHUNK_SIZE);
                const chunk = video.slice(start, end);

                try {
                    await axiosInstance.post(`${endpoints.uploadChunk}/${uploadId}/${i}`, chunk, {
                        headers: {
                            'Content-Type': 'application/octet-stream',
                        },
                        signal,
                    });
                    chunksUploadedCount++;
                    const currentProgress = Math.round(((chunksUploadedCount) / totalChunks) * 100);
                    setProgress(currentProgress);
                    if (onProgress) onProgress(currentProgress);
                } catch (chunkError) {
                    if (axiosInstance.isCancel(chunkError)) {
                        console.log('Chunk upload canceled:', chunkError.message);
                        throw new Error('Upload canceled.');
                    } else {
                        console.error(`Failed to upload video chunk ${i} for ${uploadId}:`, chunkError);
                        toast.error(`Failed to upload video chunk ${i}. Please check console.`);
                        throw new Error(`Video chunk upload failed: ${chunkError.message}`);
                    }
                }
            }

            // --- Finalize Video Upload ---
            setProgress(100);
            if (onProgress) onProgress(100);
            toast.info('All video chunks uploaded. Finalizing video...');

            const finalizeResponse = await axiosInstance.post(`${endpoints.uploadComplete}/${uploadId}`, {}, { signal });
            const finalVideoDetails = finalizeResponse.data;
            // console.log("Final video URL:", finalVideoUrl);

            // --- Post metadata to your backend (for your database) ---
            await axiosInstance.post(endpoints.mediaMetadata, {
                title,
                description,
                category,
                thumbnailId: thumbnailDetails && thumbnailDetails?.fileDetails?.file?.fileId || undefined,
                mediaFileId: finalVideoDetails?.filesDetails?.fileDetails?.fileId, // Pass the obtained thumbnail URL
                mediaType: mediaType,
            }, { signal });

            toast.success('Video upload and metadata saved successfully!');
            return { thumbUrl: thumbnailDetails?.filesDetails?.downloadUrl, videoUrl: finalVideoDetails?.filesDetails?.filesDetails?.downloadUrl };
        } catch (err) {
            console.error("Video upload process error:", err);
            if (err.message !== 'Upload canceled.') {
                toast.error(err.message || 'Failed to upload video. Please try again.');
            }
            throw err;
        } finally {
            setIsUploading(false);
            setProgress(0);
            uploadAbortController.current = null;
        }
    };

    const cancelUpload = () => {
        if (uploadAbortController.current) {
            uploadAbortController.current.abort();
            toast.info('Upload canceled.'); // General cancel toast
            setIsUploading(false);
            setProgress(0);
        }
    };

    return {
        uploadCompleteVideo,
        uploadImage, // Expose the new image upload function
        isUploading,
        progress,
        cancelUpload,
    };
}