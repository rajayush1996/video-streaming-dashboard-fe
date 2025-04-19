'use client'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Box } from '@mui/material';
import { useState } from 'react';

export default function UserForm({ open, onClose, onSubmit, initialData = null }) {
  const [form, setForm] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    role: initialData?.role || 'user',
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="First Name"
            value={form.firstName}
            onChange={handleChange('firstName')}
            fullWidth
            required
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Last Name"
            value={form.lastName}
            onChange={handleChange('lastName')}
            fullWidth
            required
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            fullWidth
            required
            margin="normal"
            variant="outlined"
          />
          <TextField
            select
            label="Role"
            value={form.role}
            onChange={handleChange('role')}
            fullWidth
            required
            margin="normal"
            variant="outlined"
          >
            {roles.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
