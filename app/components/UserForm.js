'use client'
import { Modal, TextInput, Select, Button } from '@mantine/core';
import { useState } from 'react';

export default function UserForm({ opened, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', role: '' });

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ name: '', email: '', role: '' });
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add User">
      <TextInput label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <TextInput label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Select
        label="Role"
        data={['Admin', 'Editor', 'Viewer']}
        value={form.role}
        onChange={(val) => setForm({ ...form, role: val })}
      />
      <Button mt="md" onClick={handleSubmit}>Submit</Button>
    </Modal>
  );
}
