'use client';
import { Container, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function VerifyEmailSent() {
  const router = useRouter();

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
        <Typography variant="h4" component="h1" gutterBottom>
          Check your email
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          We've sent you an email with a link to verify your account. Please check your inbox and click the link to continue.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            router.push('/signin');
            toast.success('Please check your email for verification link');
          }}
        >
          Return to Sign In
        </Button>
      </Box>
    </Container>
  );
}
