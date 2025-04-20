'use client';
import { IconTrash, IconPencil, IconSend } from '@tabler/icons-react';

export default function BlogTable({ blogs, onEdit, onDelete, onPublish }) {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8 font-[Poppins]">No blog posts available.</div>
    );
  }

  return (
    <div className="space-y-4 font-[Poppins]">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="flex justify-between items-start bg-white shadow-sm rounded-md p-4 hover:shadow-md transition-all"
        >
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[#0f172a]">{blog.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {blog.status}
              </span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">{blog.content}</p>
            <div className="mt-1 text-sm text-gray-500">{blog.category}</div>
          </div>

          <div className="flex gap-2 mt-1">
            {blog.status === 'draft' && (
              <button
                onClick={() => onPublish(blog.id)}
                className="text-green-600 hover:text-green-800 transition"
                title="Publish"
              >
                <IconSend size={18} />
              </button>
            )}
            <button
              onClick={() => onEdit(blog.id)}
              className="text-blue-600 hover:text-blue-800 transition"
              title="Edit"
            >
              <IconPencil size={18} />
            </button>
            <button
              onClick={() => onDelete(blog.id)}
              className="text-red-600 hover:text-red-800 transition"
              title="Delete"
            >
              <IconTrash size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
