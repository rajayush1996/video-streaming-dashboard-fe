"use client";
import { useRef, useState } from "react";
import { useVideoUploader } from "@/hooks/useVideoUploader";
import { Progress } from "@mantine/core";

export default function VideoForm() {
  const { uploadCompleteVideo } = useVideoUploader();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    thumbnail: "",
    video: "",
  });
  const thumbnailRef = useRef(null);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleFileChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      await uploadCompleteVideo({
        ...form,
        onProgress: setProgress,
      });
      setForm({
        title: "",
        description: "",
        category: "",
        thumbnail: "",
        video: "",
      });
      thumbnailRef.current.value = "";
      videoRef.current.value = "";
      setProgress(0);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 mt-12 font-[Poppins]">
      <h2 className="text-2xl font-semibold text-[#0f172a] mb-6">
        Upload New Video
      </h2>

      {isUploading && (
        <Progress
          value={progress}
          size="sm"
          radius="xl"
          className="mb-4"
          color="blue"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium text-[#0f172a]">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={handleChange("title")}
            required
            className="w-full border-2 border-[#0f172a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            placeholder="Enter video title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium text-[#0f172a]">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            rows={3}
            className="w-full border-2 border-[#0f172a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            placeholder="Describe your video..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium text-[#0f172a]">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={form.category}
            onChange={handleChange("category")}
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

        {/* Thumbnail */}
        <div>
          <label className="block mb-1 font-medium text-[#0f172a]">
            Thumbnail <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange("thumbnail")}
            required
            ref={thumbnailRef}
            className="block w-full text-sm text-gray-600 border-2 border-[#0f172a] rounded-md cursor-pointer px-4 py-2"
          />
        </div>

        {/* Video File */}
        <div>
          <label className="block mb-1 font-medium text-[#0f172a]">
            Video File <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange("video")}
            required
            ref={videoRef}
            className="block w-full text-sm text-gray-600 border-2 border-[#0f172a] rounded-md cursor-pointer px-4 py-2"
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={isUploading}
            className="cursor-pointer w-full bg-[#0f172a] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#1e293b] transition-all duration-200"
          >
            {isUploading ? "Uploading..." : "Submit Video"}
          </button>
        </div>
      </form>
    </div>
  );
}
