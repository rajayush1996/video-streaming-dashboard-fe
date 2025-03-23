"use client";
import { useState } from "react";
import { Button, Container } from "@mantine/core";
import BlogTable from "../components/BlogTable";
import { useRouter } from "next/navigation";
const blogsData = [
  {
    id: "b1",
    title: "Welcome to Desibhabhi Nights!",
    content:
      "We’re super excited to share behind-the-scenes stories and updates from the making of your favorite scenes.",
    category: "Updates",
  },
  {
    id: "b2",
    title: "The Secret Behind Lusty Hub’s New Series",
    content:
      "Lusty Hub is dropping a new thriller series this month. Here’s what you need to know before it premieres...",
    category: "Stories",
  },
  {
    id: "b3",
    title: "Filming the Rain Scene – What Really Happened",
    content:
      "Shooting romantic rain scenes isn’t as easy as it looks. Here’s the story of how the team pulled off that one-shot magic.",
    category: "Behind the Scenes",
  },
];

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [opened, setOpened] = useState(false);

  const handleAdd = (blog) => {
    setBlogs([...blogs, { ...blog, id: Date.now() }]);
    setOpened(false);
  };

  const handleDelete = (id) => {
    setBlogs(blogs.filter((b) => b.id !== id));
  };

  return (
    <Container>
      <Button
        className="mb-[20px]"
        radius="md"
        size="md"
        onClick={() => router.push("/blogs/upload")}
        styles={{
          root: {
            backgroundColor: "#334155",
            color: "white",
            fontWeight: 600,
            fontSize: "15px",
            padding: "12px",
            borderRadius: "10px",
            transition: "all 0.2s ease",
            fontFamily: "Poppins, sans-serif",
          },
          rootHovered: {
            backgroundColor: "#60a5fa",
          },
        }}
      >
        Add Blogs
      </Button>
      <BlogTable blogs={blogsData} onDelete={handleDelete} />
    </Container>
  );
}
