"use client";

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
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";

import {
  useCategoryTreeByType,
  useCreateCategory,
  useAllCategories,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";

const categoryTypes = ["videos", "reels", "blogs"];

export default function SettingsOverview() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "",
    parentId: "", // always set to string, not undefined or null
    id: null,
  });
  const [editMode, setEditMode] = useState(false);

  const { mutate: createCategory } = useCreateCategory();
  const { data: allCategoriesData = {} } = useAllCategories({
    type: form.type,
    enabled: !!form.type, // only fetch when type exists
  });

  const allCategories = allCategoriesData?.data?.results || [];

  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleChange = (e) => {
    console.log("🚀 ~ handleChange ~ e.target.value:", e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    console.log("🚀 ~ handleParentChange ~ e.target:", e.target);
    setForm((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  const handleEditCategory = (category) => {
    setForm({
      name: category.name,
      type: category.type,
      parentId: category.parentId || "",
      id: category._id,
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id, {
        onSuccess: () => toast.success("Category deleted successfully!"),
        onError: () => toast.error("Failed to delete category"),
      });
    }
  };

  const handleCreate = () => {
    const payload = {
      name: form.name,
      type: form.type,
      parentId: form.parentId || null,
    };

    if (editMode && form.id) {
      updateCategory.mutate(
        { id: form.id, payload },
        {
          onSuccess: () => {
            toast.success("Category updated successfully!");
            setOpen(false);
            setForm({ name: "", type: "", parentId: "", id: null });
            setEditMode(false);
          },
          onError: () => {
            toast.error("Failed to update category");
          },
        }
      );
    } else {
      createCategory(payload, {
        onSuccess: () => {
          toast.success("Category created successfully!");
          setOpen(false);
          setForm({ name: "", type: "", parentId: "", id: null });
        },
        onError: () => {
          toast.error("Failed to create category");
        },
      });
    }
  };

  const renderFullTree = (category, level = 0) => (
    <Box key={category._id} position="relative" ml={level * 3} mt={1}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          pl: 2,
          gap: 1,
          "&::before":
            level > 0
              ? {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "1px",
                  backgroundColor: "#555",
                }
              : {},
          "&::after":
            level > 0
              ? {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  width: "16px",
                  height: "1px",
                  backgroundColor: "#555",
                }
              : {},
        }}
      >
        <Chip
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                {category.name}
              </Typography>
              <IconButton
                size="small"
                sx={{ p: 0.5, color: "white" }}
                onClick={() => handleEditCategory(category)}
              >
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton
                size="small"
                sx={{ p: 0.5, color: "white" }}
                onClick={() => handleDeleteCategory(category._id)}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          }
          sx={{
            backgroundColor: "#0ea5e9",
            color: "white",
            borderRadius: "12px",
            px: 2,
            py: 1,
          }}
        />
      </Box>

      {category?.children?.map((child) => renderFullTree(child, level + 1))}
    </Box>
  );

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Settings Overview
      </Typography>

      <Box mb={4}>
        <Typography variant="h6">General Settings</Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Coming Soon...
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box mb={4}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6">Manage Categories</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            + Create Category
          </Button>
        </Stack>

        {categoryTypes.map((type) => {
          const { data: treeData = [], isLoading } =
            useCategoryTreeByType(type);
          return (
            <Box key={type} mb={4}>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
              >
                {type.toUpperCase()}
              </Typography>
              {isLoading ? (
                <Typography variant="body2">Loading...</Typography>
              ) : (
                <Box display="flex" gap={4} flexWrap="wrap">
                  {treeData?.data?.map((rootCat) => (
                    <Box key={rootCat._id || rootCat.name} minWidth="200px">
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
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Coming Soon...
        </Typography>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {editMode ? "Edit Category" : "Create Category"}
        </DialogTitle>
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
              <Select
                name="type"
                label="Type"
                value={form.type || ""} // fallback to empty string
                onChange={handleChange}
              >
                {categoryTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!form.type}>
              <InputLabel>Parent Category</InputLabel>
              <Select
                name="parentId"
                label="Parent Category"
                value={form.parentId || ""} // avoid undefined
                onChange={handleParentChange}
              >
                <MenuItem value="">None</MenuItem>
                {allCategories
                  .filter((cat) => cat.type === form.type) // ✅ filter only same type
                  .map((cat) => (
                    <MenuItem key={cat.id || cat._id} value={cat.id || cat._id}>
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
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
