'use client';

import AuthGuard from '@utils/authGuard';
import { Box, Container } from '@mui/material';
import AdminSidebar from '@components/admin/AdminSidebar';
import AdminHeader from '@components/admin/AdminHeader';

export default function AdminLayout({ children }) {
  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <AdminHeader />
          <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
            {children}
          </Container>
        </Box>
      </Box>
    </AuthGuard>
  );
} 