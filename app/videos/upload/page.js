"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useVideoUploader } from "@hooks/useVideoUploader";
import { IconUpload, IconPhoto, IconVideo } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { useCategoriesByType } from '@/hooks/useCategories';
import { uploadThumbnail, useVideoUpload } from "@/hooks/useVideoUpload";

export default function UploadVideoPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [category, setCategory] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  // const { uploadCompleteVideo } = useVideoUploader();
  const { data: categories = [] } = useCategoriesByType('videos');

  const { handleFileSelect, startUpload, progress, uploading, errorMessage, fileName } = useVideoUpload({
    zone: process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE,
    accessKey: process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY,
    onComplete: (fileName) => {
      router.push('/videos')
    }
  });




  const handleSelectedFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
      setVideo(file);
    }
  };

  useEffect(() => {
    if (categories.length > 0) {
      setCategory(categories[0]?.id);
    }
  }, [categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !video || !category) {
      toast.error('Please fill in all required fields and upload the video');
      return;
    }
    let thumbnailUrl = null;
    if (thumbnail) {
      setUploadProgress(1)
      thumbnailUrl = await uploadThumbnail(
        thumbnail,
        process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE,
        process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY
      );
    }
    try {
      await startUpload({
        title,
        description: description || undefined,
        category,
        thumbnailUrl: thumbnailUrl || undefined,
        mediaType: 'video',
      }); // Wait for upload to finish
      toast.success('Video uploaded successfully!');
      // router.push('/videos');
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      toast.error(error.message || 'Failed to upload video');
    } finally {
      setUploadProgress(0);
      setTitle('');
      setDescription('');
      setThumbnail(null);
      setVideo(null);
      setCategory(categories[0]?.id || '');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gray-900/70 rounded-2xl shadow-xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">🎬 Upload New Video</h1>

        {progress > 0 && (
          <div className="mb-6">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center">
              Uploading: {Math.round(progress)}%
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="text-gray-300 font-medium mb-1 block">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="text-gray-300 font-medium mb-1 block">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="text-gray-300 font-medium mb-1 block">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail Upload (optional) */}
            <div>
              <label className="text-gray-300 font-medium mb-1 block">
                Thumbnail (Optional)
              </label>
              <label
                htmlFor="thumbnail-upload"
                className="flex items-center justify-center h-32 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 transition"
              >
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="text-gray-400 text-sm flex flex-col items-center">
                  <IconPhoto size={24} />
                  <span>{thumbnail ? thumbnail.name : "Click to upload thumbnail"}</span>
                </div>
              </label>
            </div>

            {/* Video Upload (required) */}
            <div>
              <label className="text-gray-300 font-medium mb-1 block">
                Video <span className="text-red-500">*</span>
              </label>
              <label
                htmlFor="video-upload"
                className="flex items-center justify-center h-32 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 transition"
              >
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleSelectedFile}
                  required
                  className="hidden"
                />
                <div className="text-gray-400 text-sm flex flex-col items-center">
                  <IconVideo size={24} />
                  <span>{video ? video.name : "Click to upload video"}</span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={uploading}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${uploadProgress > 0
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              <IconUpload size={20} />
              {uploading ? "Uploading..." : "Upload Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
