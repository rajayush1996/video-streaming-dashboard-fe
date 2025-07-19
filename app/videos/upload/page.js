'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast }      from 'react-toastify';
import { IconPhoto, IconUpload, IconVideo } from '@tabler/icons-react';
import { useCategoriesByType } from '@/hooks/useCategories';
import { useVideoUpload } from '@/hooks/useVideoUploads';
// import HlsPlayer from '@/components/HlsPlayer';

export default function UploadVideoPage() {
  const router = useRouter();
  const { data: categories = [] } = useCategoriesByType('videos');

  const [title, setTitle]         = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory]   = useState('');
  const [file, setFile]           = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);



  const {
    startUpload,
    progress,
    uploading,
    videoId,
    error
  } = useVideoUpload();

  useEffect(() => {
    if (categories.length) setCategory(categories[0].id);
  }, [categories]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title || !video || !category) {
      return toast.error('Please fill all fields & pick a video');
    }
    console.log(video);
    try {
      const { playbackUrl } = await startUpload(video, {
        title, description, category
      });
      // ✏️ Save video record in your DB:
      // await fetch('/api/save-video', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ title, description, category, videoId, playbackUrl })
      // });

      toast.success('Uploaded & saved!');
      router.push('/videos');
    } catch {
      toast.error(error || 'Upload failed');
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
    <div className="bg-gray-900/70 rounded-2xl shadow-xl p-8 border border-gray-700">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        🎬 Upload New Video
      </h1>

      {progress > 0 && (
        <div className="mb-6">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2 text-center">
            Uploading: {progress}%
          </p>
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title, Description, Category blocks unchanged */}
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
        {/* Thumbnail Upload */}
        <div>
          <label className="text-gray-300 font-medium mb-1 block">
            Thumbnail (optional)
          </label>
          <label
            htmlFor="thumbnail-upload"
            className="flex items-center justify-center h-32 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 transition"
          >
            <input
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => setThumbnail(e.target.files?.[0] || null)}
              disabled={uploading}
            />
            <div className="text-gray-400 text-sm flex flex-col items-center">
              <IconPhoto size={24} />
              <span>
                {thumbnail ? thumbnail.name : 'Click to upload thumbnail'}
              </span>
            </div>
          </label>
        </div>

        {/* Video Upload */}
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
              className="hidden"
              onChange={e => setVideo(e.target.files?.[0] || null)}
              disabled={uploading}
              required
            />
            <div className="text-gray-400 text-sm flex flex-col items-center">
              <IconVideo size={24} />
              <span>{video ? video.name : 'Click to upload video'}</span>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600"
          >
            <IconUpload size={20} />
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </form>

      {/* HLS Preview */}
      {/* {videoId && (
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-2 text-white">
            Preview
          </h2>
          <HlsPlayer
            src={`https://${process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE}/${videoId}/playlist.m3u8`}
          />
        </div>
      )} */}
    </div>
  </main>
  );
}
