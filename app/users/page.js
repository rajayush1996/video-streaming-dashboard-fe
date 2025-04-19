'use client';
import { Container, Button, Typography, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import UserTable from '@components/UserTable';
import UserForm from '@components/UserForm';
import { useState } from 'react';
import { useUsers } from '@hooks/useUsers';

export default function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { users, isLoading, error, createUser, updateUser, deleteUser } = useUsers();

  const handleOpenForm = (user = null) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedUser(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
      } else {
        await createUser(formData);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(user.id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add User
        </Button>
      </Box>

      <UserTable
        users={users}
        onEdit={handleOpenForm}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <UserForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={selectedUser}
      />
    </Container>
  );
}
