import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const dummyTypes = ['video', 'reel', 'blog'];

const dummyCategories = [
  { id: '1', name: 'Technology', type: 'video', parentId: null },
  { id: '2', name: 'AI', type: 'video', parentId: '1' },
  { id: '3', name: 'ReactJS', type: 'video', parentId: '2' },
  { id: '4', name: 'Health', type: 'blog', parentId: null },
  { id: '5', name: 'Fitness', type: 'blog', parentId: '4' },
];

export default function CategoryManager() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: '',
    parentId: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    console.log('Create category:', form);
    setOpen(false);
    setForm({ name: '', type: '', parentId: '' });
  };

  const filteredParents = dummyCategories.filter((cat) => cat.type === form.type);

  const renderTree = (items, parentId = null, level = 0) => {
    return items
      .filter((item) => item.parentId === parentId)
      .map((item) => (
        <Box key={item.id} ml={level * 2} mt={1}>
          <Chip label={`${item.name}`} color="primary" />
          {renderTree(items, item.id, level + 1)}
        </Box>
      ));
  };

  return (
    <Box p={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Manage Categories</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Create Category
        </Button>
      </Stack>

      <Box>
        {dummyTypes.map((type) => (
          <Box key={type} mb={3}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {type.toUpperCase()}
            </Typography>
            {renderTree(dummyCategories.filter((c) => c.type === type))}
          </Box>
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Create Category</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              name="name"
              label="Category Name"
              value={form.name}
              onChange={handleChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select name="type" value={form.type} onChange={handleChange}>
                {dummyTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!form.type}>
              <InputLabel>Parent Category</InputLabel>
              <Select name="parentId" value={form.parentId} onChange={handleChange}>
                <MenuItem value="">None</MenuItem>
                {filteredParents.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
