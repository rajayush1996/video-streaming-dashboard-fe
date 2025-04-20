import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as usersApi from '@apis/users/usersApi';

// Fetch users with search, pagination and filters
export const useUsers = (params = {}) => {
  const { page = 1, limit = 10, search = '', status = '', subscription = '' } = params;
  
  return useQuery({
    queryKey: ['users', { page, limit, search, status, subscription }],
    queryFn: () => usersApi.fetchUsers({ page, limit, search, status, subscription }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (err) => {
      toast.error(err.message || 'Failed to fetch users');
    }
  });
};

// Admin: Fetch users with search, pagination, role filtering
export const useAdminUsers = (params = {}) => {
  const { page = 1, limit = 10, search = '', role = '', isActive, includeDeleted = false } = params;
  
  return useQuery({
    queryKey: ['admin-users', { page, limit, search, role, isActive, includeDeleted }],
    queryFn: () => usersApi.fetchAdminUsers({ page, limit, search, role, isActive, includeDeleted }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (err) => {
      toast.error(err.message || 'Failed to fetch users');
    }
  });
};

// Fetch a single user by ID
export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.fetchUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    onError: (err) => {
      toast.error(err.message || 'Failed to fetch user details');
    }
  });
};

// Admin: Fetch a single user by ID
export const useAdminUser = (id) => {
  return useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => usersApi.fetchAdminUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    onError: (err) => {
      toast.error(err.message || 'Failed to fetch user details');
    }
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.updateUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      toast.success('User updated successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update user');
    }
  });
};

// Admin: Update user
export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.updateAdminUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', variables.id] });
      toast.success('User updated successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update user');
    }
  });
};

// Suspend user
export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.suspendUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables] });
      toast.success('User suspended successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to suspend user');
    }
  });
};

// Activate user
export const useActivateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.activateUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables] });
      toast.success('User activated successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to activate user');
    }
  });
};

// Admin: Change user status
export const useChangeUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params) => usersApi.changeUserStatus(params.id, params.status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', variables.id] });
      toast.success(`User ${variables.status === 'active' ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to change user status');
    }
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete user');
    }
  });
};

// Admin: Delete user
export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.deleteAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete user');
    }
  });
};

// Invite new user
export const useInviteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.inviteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Invitation sent successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to send invitation');
    }
  });
};

// Admin: Create new user
export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.createAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User created successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create user');
    }
  });
};

// Resend invitation
export const useResendInvitation = () => {
  return useMutation({
    mutationFn: usersApi.resendInvitation,
    onSuccess: () => {
      toast.success('Invitation resent successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to resend invitation');
    }
  });
}; 