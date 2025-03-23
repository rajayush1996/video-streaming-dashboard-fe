'use client';
import { useState } from 'react';

export default function VideoForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 mt-12 font-[Poppins]">
      <h2 className="text-2xl font-semibold text-[#0f172a] mb-6">Upload New Video</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <div>
          <label className="block mb-1 font-medium text-[#0f172a]">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.title}
            onChange={handleChange('title')}
            required
            className="w-full border-2 border-[#0f172a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            placeholder="Enter video title"
          />
        </div>

        {/* URL */}
        <div>
          <label className="block mb-1 font-medium text-[#0f172a]">Video URL <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.url}
            onChange={handleChange('url')}
            required
            className="w-full border-2 border-[#0f172a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            placeholder="https://cdn.com/video.mp4"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium text-[#0f172a]">Description</label>
          <textarea
            value={form.description}
            onChange={handleChange('description')}
            rows={3}
            className="w-full border-2 border-[#0f172a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            placeholder="Describe your video..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium text-[#0f172a]">Category <span className="text-red-500">*</span></label>
          <select
            value={form.category}
            onChange={handleChange('category')}
            required
            className="w-full border-2 border-[#0f172a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
          >
            <option value="">Choose category</option>
            <option value="Romance">Romance</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            <option value="Thriller">Thriller</option>
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="cursor-pointer w-full bg-[#0f172a] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#1e293b] transition-all duration-200"
          >
            Submit Video
          </button>
        </div>
      </form>
    </div>
  );
}
