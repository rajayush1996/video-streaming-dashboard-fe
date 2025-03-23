'use client';
import { useState } from 'react';

export default function BlogForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
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
      <h2 className="text-2xl font-semibold text-[#0f172a] mb-6">Create New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block mb-1 font-medium text-[#0f172a]">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.title}
            onChange={handleChange('title')}
            required
            className="w-full border-2 border-[#0f172a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            placeholder="Enter blog title"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#0f172a]">Content</label>
          <textarea
            value={form.content}
            onChange={handleChange('content')}
            rows={6}
            className="w-full border-2 border-[#0f172a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            placeholder="Write your blog content..."
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#0f172a]">Category</label>
          <select
            value={form.category}
            onChange={handleChange('category')}
            className="w-full border-2 border-[#0f172a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
          >
            <option value="">Choose category</option>
            <option value="Updates">Updates</option>
            <option value="Behind the Scenes">Behind the Scenes</option>
            <option value="Stories">Stories</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-[#0f172a] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#1e293b] transition-all duration-200"
          >
            Submit Blog
          </button>
        </div>
      </form>
    </div>
  );
}
