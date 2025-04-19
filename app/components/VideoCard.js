import { useState } from 'react';
import { IconPlayerPlay, IconEdit, IconTrash, IconRestore } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useDeleteVideo, useUpdateVideo, useRestoreVideo } from '@/hooks/useVideos';
import { toast } from 'react-toastify';

export default function VideoCard({ video }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: video.title,
    description: video.description,
    category: video.category,
  });

  const deleteVideo = useDeleteVideo();
  const updateVideo = useUpdateVideo();
  const restoreVideo = useRestoreVideo();

  const handlePlay = () => {
    router.push(`/videos/${video.id}`);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateVideo.mutateAsync({
        id: video.id,
        data: editData,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: video.title,
      description: video.description,
      category: video.category,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo.mutateAsync(video.id);
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const handleRestore = async () => {
    try {
      await restoreVideo.mutateAsync(video.id);
    } catch (error) {
      console.error('Failed to restore:', error);
    }
  };

  const categories = [
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'education', label: 'Education' },
  ];

  return (
    <div className="bg-gray-800/50 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all duration-200">
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200"
        >
          <IconPlayerPlay className="w-12 h-12 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          // Edit Form
          <div className="space-y-3">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Video title"
            />
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Video description"
            />
            <select
              value={editData.category}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
              className="w-full bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updateVideo.isLoading}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updateVideo.isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          // Display Mode
          <>
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {video.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {video.description}
            </p>
            
            {/* Category Badge */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-full">
                {video.category}
              </span>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  disabled={updateVideo.isLoading}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors duration-200"
                >
                  <IconEdit size={18} />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteVideo.isLoading}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors duration-200"
                >
                  <IconTrash size={18} />
                </button>
                {video.isDeleted && (
                  <button
                    onClick={handleRestore}
                    disabled={restoreVideo.isLoading}
                    className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-full transition-colors duration-200"
                  >
                    <IconRestore size={18} />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 