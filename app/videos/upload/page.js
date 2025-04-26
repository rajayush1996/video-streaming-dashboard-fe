"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVideoUploader } from "@hooks/useVideoUploader";
import { IconUpload, IconPhoto, IconVideo } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { useCategoriesByType } from '@/hooks/useCategories';


export default function UploadVideoPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [category, setCategory] = useState('technology');
  const [uploadProgress, setUploadProgress] = useState(0);
  const { uploadCompleteVideo } = useVideoUploader();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !thumbnail || !video || !category) {
      toast.error('Please fill in all fields and upload both thumbnail and video', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    try {
      const fileId = `vid-${Date.now()}`;
      await uploadCompleteVideo({
        title,
        description,
        category,
        thumbnail,
        video,
        fileId,
        onProgress: (progress) => setUploadProgress(progress)
      });

      toast.success('Video uploaded successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      router.push('/videos');
    } catch (error) {
      toast.error(error.message || 'Failed to upload video', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const { data: categories = [] } = useCategoriesByType('videos');
  console.log("🚀 ~ UploadVideoPage ~ categories:", categories);
  

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gray-800/50 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">Upload New Video</h1>
        
        {uploadProgress > 0 && (
          <div className="mb-6">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center">
              Uploading: {Math.round(uploadProgress)}%
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter video title"
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter video description"
            />
          </div>

          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Thumbnail <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  accept="image/*"
                  required
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="flex items-center justify-center w-full h-32 px-4 transition bg-gray-700/50 border-2 border-gray-600 border-dashed rounded-lg appearance-none cursor-pointer hover:border-gray-500 focus:outline-none"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <IconPhoto size={24} className="text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {thumbnail ? thumbnail.name : 'Click to upload thumbnail'}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Video <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setVideo(e.target.files[0])}
                  accept="video/*"
                  required
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="flex items-center justify-center w-full h-32 px-4 transition bg-gray-700/50 border-2 border-gray-600 border-dashed rounded-lg appearance-none cursor-pointer hover:border-gray-500 focus:outline-none"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <IconVideo size={24} className="text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {video ? video.name : 'Click to upload video'}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={uploadProgress > 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <IconUpload size={20} />
              {uploadProgress > 0 ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
