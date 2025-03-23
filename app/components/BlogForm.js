'use client'
import { Modal, TextInput, Textarea, Select, Button } from '@mantine/core';
import { useState } from 'react';

export default function BlogForm({ opened, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', content: '', category: '' });

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ title: '', content: '', category: '' });
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add Blog">
      <TextInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <Textarea label="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      <Select
        label="Category"
        data={['News', 'Opinion', 'Review']}
        value={form.category}
        onChange={(val) => setForm({ ...form, category: val })}
      />
      <Button mt="md" onClick={handleSubmit}>Submit</Button>
    </Modal>
  );
}
