'use client'
import { useState } from 'react';
import { Button, Container } from '@mantine/core';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [opened, setOpened] = useState(false);

  const handleAdd = (user) => {
    setUsers([...users, { ...user, id: Date.now() }]);
    setOpened(false);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <Container>
      <Button onClick={() => setOpened(true)} mb="md">Add User</Button>
      <UserTable users={users} onDelete={handleDelete} />
      <UserForm opened={opened} onClose={() => setOpened(false)} onSubmit={handleAdd} />
    </Container>
  );
}
