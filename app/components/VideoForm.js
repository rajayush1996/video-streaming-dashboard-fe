'use client';
import { TextInput, Textarea, Select, Button, Stack } from '@mantine/core';
import { useState } from 'react';

export default function VideoForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target?.value || e });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="md">
        <TextInput
          label="Title"
          placeholder="Enter video title"
          value={form.title}
          onChange={handleChange('title')}
          required
        />
        <TextInput
          label="Video URL"
          placeholder="https://cdn.com/video.mp4"
          value={form.url}
          onChange={handleChange('url')}
          required
        />
        <Textarea
          label="Description"
          placeholder="Short video description..."
          value={form.description}
          onChange={handleChange('description')}
          autosize
          minRows={3}
        />
        <Select
          label="Category"
          placeholder="Select category"
          data={['Romance', 'Drama', 'Thriller']}
          value={form.category}
          onChange={handleChange('category')}
          required
        />
        <Button type="submit" color="blue">
          Submit Video
        </Button>
      </Stack>
    </form>
  );
}
