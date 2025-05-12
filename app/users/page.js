'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  CircularProgress,
  TablePagination,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  Grid,
  Avatar,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { 
  useAdminUsers, 
  useAdminUser, 
  useUpdateAdminUser, 
  useDeleteAdminUser, 
  useChangeUserStatus,
  useCreateAdminUser,
} from '@hooks/useUsers';
import { toast } from 'react-hot-toast';

// Styled components for better visual hierarchy
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

// Status Chip component
const StatusChip = ({ status }) => {
  let color = 'default';
  
  switch (status.toLowerCase()) {
    case 'active':
      color = 'success';
      break;
    case 'inactive':
      color = 'warning';
      break;
    case 'suspended':
      color = 'error';
      break;
    case 'pending':
      color = 'info';
      break;
    default:
      color = 'default';
  }
  
  return <Chip label={status} color={color} size="small" />;
};

// User Management Page
export default function UsersPage() {
  const router = useRouter();
  
  // State for search, filters, and pagination
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');
  const [isActive, setIsActive] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State for user detail modal
  const [viewUserDetail, setViewUserDetail] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  // State for edit user modal
  const [editUserModal, setEditUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    isActive: true
  });
  
  // State for delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // State for create user modal
  const [createUserModal, setCreateUserModal] = useState(false);
  const [createUserData, setCreateUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    role: 'USER'
  });
  
  // Get active status as boolean
  const getActiveStatus = () => {
    if (isActive === 'true') return true;
    if (isActive === 'false') return false;
    return undefined;
  };
  
  // Fetch users data with search, filters and pagination
  const {
    data: usersData,
    isLoading,
    isError,
    refetch
  } = useAdminUsers({
    page: page + 1, // API is 1-indexed
    limit: rowsPerPage,
    search,
    role,
    isActive: getActiveStatus(),
    includeDeleted
  });
  
  // Fetch single user details when needed
  const { 
    data: userDetail,
    isLoading: isLoadingUserDetail
  } = useAdminUser(selectedUserId);
  
  // Mutations for user actions
  const updateUserMutation = useUpdateAdminUser();
  const deleteUserMutation = useDeleteAdminUser();
  const changeStatusMutation = useChangeUserStatus();
  const createUserMutation = useCreateAdminUser();
  
  // Handle search input change
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0); // Reset to first page on new search
  };
  
  // Handle search submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    refetch();
  };
  
  // Handle status filter change
  const handleStatusChange = (event) => {
    setIsActive(event.target.value);
    setPage(0);
  };
  
  // Handle role filter change
  const handleRoleChange = (event) => {
    setRole(event.target.value);
    setPage(0);
  };
  
  // Handle includeDeleted change
  const handleIncludeDeletedChange = (event) => {
    setIncludeDeleted(event.target.checked);
    setPage(0);
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle view user
  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setViewUserDetail(true);
  };
  
  // Handle edit user modal open
  const handleEditUser = (user) => {
    setEditUserData({
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      role: user.role || 'USER',
      isActive: user.isActive
    });
    setEditUserModal(true);
  };
  
  // Handle update user
  const handleUpdateUser = async () => {
    try {
      await updateUserMutation.mutateAsync({
        id: editUserData.id,
        firstName: editUserData.firstName,
        lastName: editUserData.lastName,
        role: editUserData.role
      });
      setEditUserModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  
  // Handle delete user
  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
  };
  
  // Confirm delete user
  const confirmDeleteUser = async () => {
    try {
      await deleteUserMutation.mutateAsync(userToDelete);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      toast.success('User has been deactivated and marked as deleted');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user. Please try again.');
    }
  };
  
  // Handle change user status (activate/deactivate)
  const handleChangeStatus = async (userId, newStatus) => {
    try {
      await changeStatusMutation.mutateAsync({
        id: userId,
        status: newStatus
      });
    } catch (error) {
      console.error(`Error changing user status to ${newStatus}:`, error);
    }
  };
  
  // Handle create user modal open
  const handleCreateUserOpen = () => {
    setCreateUserData({
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      role: 'USER'
    });
    setCreateUserModal(true);
  };
  
  // Handle create user
  const handleCreateUser = async () => {
    try {
      await createUserMutation.mutateAsync(createUserData);
      setCreateUserModal(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setIsActive('');
    setRole('');
    setIncludeDeleted(false);
    setPage(0);
  };
  
  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Mock data for testing UI
  const mockUsers = Array(15).fill().map((_, index) => ({
    id: `user-${index + 1}`,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    status: ['Active', 'Inactive', 'Suspended', 'Pending'][Math.floor(Math.random() * 4)],
    subscription: ['Free', 'Premium', 'Enterprise'][Math.floor(Math.random() * 3)],
    registrationDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
  }));
  
  // Use mock data until real API is integrated
  const users = usersData?.results;

  const totalUsers = usersData?.totalResults || 0;
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        User Management
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        {/* Search and Filters */}
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <form onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                placeholder="Search users by name or email..."
                value={search}
                onChange={handleSearchChange}
                variant="outlined"
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearch('')} size="small">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Box>
          
          {/* Status filter */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={isActive}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
          
          {/* Role filter */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel id="role-filter-label">Role</InputLabel>
            <Select
              labelId="role-filter-label"
              value={role}
              onChange={handleRoleChange}
              label="Role"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="CREATOR">Creator</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch
                checked={includeDeleted}
                onChange={handleIncludeDeletedChange}
                color="primary"
              />
            }
            label="Include deleted users"
            sx={{ ml: 2 }}
          />
          
          <Tooltip title="Clear filters">
            <IconButton onClick={clearFilters} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PersonAddIcon />}
            onClick={handleCreateUserOpen}
          >
            Create User
          </Button>
        </Box>
        
        {/* Users Table */}
        <TableContainer sx={{ maxHeight: 'calc(100vh - 280px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={40} sx={{ my: 3 }} />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="error">Error loading users. Please try again.</Typography>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="textSecondary">No users found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <StyledTableRow key={user.id}>
                    <TableCell>
                      { user.name } 
                      {user.deletedAt && (
                        <Chip
                          label="Deleted"
                          color="default"
                          size="small"
                          sx={{ ml: 1, backgroundColor: '#f5f5f5' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{user.username || user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status === 'active' ? 'Active' : 'Inactive'} 
                        color={user.status === 'active' ? 'success' : 'error'}
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        color={
                          user.role === 'ADMIN' ? 'primary' : 
                          user.role === 'CREATOR' ? 'secondary' : 'default'
                        }
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => handleViewUser(user.id)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditUser(user)} disabled={user.deletedAt}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {!user.deletedAt && (
                        <>
                          {user.isActive ? (
                            <Tooltip title="Deactivate">
                              <IconButton 
                                size="small" 
                                color="warning"
                                onClick={() => handleChangeStatus(user.id, 'inactive')}
                              >
                                <BlockIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Activate">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => handleChangeStatus(user.id, 'active')}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        <TablePagination
          component="div"
          count={totalUsers}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
      
      {/* View User Detail Modal */}
      <Dialog 
        open={viewUserDetail} 
        onClose={() => setViewUserDetail(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          User Details
        </DialogTitle>
        <IconButton
          onClick={() => setViewUserDetail(false)}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          {isLoadingUserDetail ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem' }}>
                    {userDetail?.firstName?.charAt(0) || "U"}
                  </Avatar>
                  <Typography variant="h6">{userDetail?.firstName || "User Name"}</Typography>
                  <Typography variant="body2" color="textSecondary">{userDetail?.email }</Typography>
                  <Box sx={{ mt: 2 }}>
                    <StatusChip status={userDetail?.isActive ? "Active" : "Inactive"} />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Account Information</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">User ID</Typography>
                        <Typography variant="body1">{userDetail?.id || "N/A"}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Role</Typography>
                        <Typography variant="body1">{userDetail?.role || "N/A"}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Registration Date</Typography>
                        <Typography variant="body1">{userDetail?.createdAt ? formatDate(userDetail.createdAt) : "N/A"}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Last Login</Typography>
                        <Typography variant="body1">{userDetail?.lastLogin ? formatDate(userDetail.lastLogin) : "Never"}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Deletion Date</Typography>
                        <Typography variant="body1">
                          {userDetail?.deletedAt ? formatDate(userDetail.deletedAt) : "Not deleted"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Activity Statistics</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" color="textSecondary">Videos</Typography>
                        <Typography variant="h5">{userDetail?.videosCount || 0}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" color="textSecondary">Blogs</Typography>
                        <Typography variant="h5">{userDetail?.blogsCount || 0}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" color="textSecondary">Comments</Typography>
                        <Typography variant="h5">{userDetail?.commentsCount || 0}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewUserDetail(false)}>Close</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              setViewUserDetail(false);
              handleEditUser(userDetail || {});
            }}
          >
            Edit User
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit User Modal */}
      <Dialog 
        open={editUserModal} 
        onClose={() => setEditUserModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={editUserData.firstName}
                  onChange={(e) => setEditUserData({...editUserData, firstName: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={editUserData.lastName}
                  onChange={(e) => setEditUserData({...editUserData, lastName: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={editUserData.role}
                    label="Role"
                    onChange={(e) => setEditUserData({...editUserData, role: e.target.value})}
                  >
                    <MenuItem value="USER">User</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="CREATOR">Creator</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserModal(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateUser} 
            variant="contained" 
            color="primary"
            disabled={updateUserMutation.isLoading}
          >
            {updateUserMutation.isLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Soft Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? The user will be marked as deleted and deactivated, but their data will be preserved in the system. You can still view deleted users by enabling "Include deleted users" in the filters.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            color="error" 
            onClick={confirmDeleteUser}
            disabled={deleteUserMutation.isLoading}
          >
            {deleteUserMutation.isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create User Dialog */}
      <Dialog open={createUserModal} onClose={() => setCreateUserModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the details for the new user.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={createUserData.firstName}
                onChange={(e) => setCreateUserData({...createUserData, firstName: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={createUserData.lastName}
                onChange={(e) => setCreateUserData({...createUserData, lastName: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                value={createUserData.username}
                onChange={(e) => setCreateUserData({...createUserData, username: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={createUserData.password}
                onChange={(e) => setCreateUserData({...createUserData, password: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={createUserData.role}
                  label="Role"
                  onChange={(e) => setCreateUserData({...createUserData, role: e.target.value})}
                >
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="CREATOR">Creator</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateUserModal(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateUser} 
            variant="contained" 
            color="primary"
            disabled={createUserMutation.isLoading}
          >
            {createUserMutation.isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
