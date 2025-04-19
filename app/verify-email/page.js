'use client';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { verifyEmail } from '@apis/auth/authApi';

export default function VerifyEmail() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        toast.success('Email verified successfully!');
      } catch (err) {
        setError(err.message || 'Failed to verify email');
        toast.error(err.message || 'Failed to verify email');
      } finally {
        setIsVerifying(false);
      }
    };

    if (token) {
      verify();
    } else {
      setError('No verification token provided');
      setIsVerifying(false);
    }
  }, [token]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 2,
        }}
      >
        {isVerifying ? (
          <>
            <CircularProgress />
            <Typography variant="h6">Verifying your email...</Typography>
          </>
        ) : error ? (
          <>
            <Typography variant="h4" color="error" gutterBottom>
              Verification Failed
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {error}
            </Typography>
            <Button variant="contained" href="/signin">
              Return to Sign In
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Email Verified!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your email has been successfully verified. You can now sign in to your account.
            </Typography>
            <Button variant="contained" href="/signin">
              Sign In
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}
