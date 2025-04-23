import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  useCategoryTreeByType,
  useCreateCategory,
  useAllCategories,
} from '@/hooks/useCategories';

const categoryTypes = ["videos", "reels", "blogs"];

export default function SettingsOverview() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "", parentId: "" });

  const { mutate: createCategory } = useCreateCategory();
  const { data: allCategories = [] } = useAllCategories({ type: form.type });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    const payload = {
      name: form.name,
      type: form.type,
      parentId: form.parentId || null,
    };

    createCategory(payload, {
      onSuccess: () => {
        toast.success("Category created successfully!");
        setOpen(false);
        setForm({ name: "", type: "", parentId: "" });
      },
      onError: () => {
        toast.error("Failed to create category");
      },
    });
  };

  const renderFullTree = (category, level = 0) => (
    <Box key={category._id} position="relative" ml={level * 3} mt={1}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          pl: 2,
          '&::before': level > 0 ? {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "1px",
            backgroundColor: "#555",
          } : {},
          '&::after': level > 0 ? {
            content: '""',
            position: "absolute",
            left: 0,
            top: "50%",
            width: "16px",
            height: "1px",
            backgroundColor: "#555",
          } : {},
        }}
      >
        <Chip
          label={category.name}
          sx={{ backgroundColor: "#0288d1", color: "white", fontWeight: 500 }}
        />
      </Box>
      {category.children?.map(child => renderFullTree(child, level + 1))}
    </Box>
  );

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Settings Overview</Typography>

      <Box mb={4}>
        <Typography variant="h6">General Settings</Typography>
        {/* <TextField label="Site Title" fullWidth margin="normal" defaultValue="My Social Platform" />
        <TextField label="Support Email" fullWidth margin="normal" defaultValue="support@example.com" />
        <TextField label="Default Language" fullWidth margin="normal" defaultValue="en" /> */}
        <Typography variant="body1" color="textSecondary" gutterBottom>Coming Soon...</Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box mb={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Manage Categories</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            + Create Category
          </Button>
        </Stack>

        {categoryTypes.map((type) => {
          const { data: treeData = [], isLoading } = useCategoryTreeByType(type);

          return (
            <Box key={type} mb={4}>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                {type.toUpperCase()}
              </Typography>

              {isLoading ? (
                <Typography variant="body2">Loading...</Typography>
              ) : (
                <Box display="flex" gap={4} flexWrap="wrap">
                  {treeData.data.map((rootCat) => (
                    <Box key={rootCat._id} minWidth="200px">
                      {renderFullTree(rootCat)}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h6">Other Settings</Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>Coming Soon...</Typography>
        {/* <TextField label="Custom Footer Text" fullWidth margin="normal" />
        <TextField label="Contact Phone" fullWidth margin="normal" /> */}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Create Category</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField name="name" label="Category Name" value={form.name} onChange={handleChange} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select name="type" value={form.type} onChange={handleChange}>
                {categoryTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type.toUpperCase()}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!form.type}>
              <InputLabel>Parent Category</InputLabel>
              <Select name="parentId" value={form.parentId} onChange={handleChange}>
                <MenuItem value="">None</MenuItem>
                {allCategories?.docs?.filter((cat) => cat.type === form.type).map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
