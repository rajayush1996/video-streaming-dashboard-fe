'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Center,
  Stack,
  Transition,
  Loader,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconCircleCheck, IconMail } from '@tabler/icons-react';
import { verifyEmail } from '@apis/auth/authApi';

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get the token from the URL query parameter
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        setErrorMessage('Verification token is missing');
        return;
      }

      try {
        await verifyEmail(token);
        setVerificationStatus('success');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/signin');
        }, 3000);
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setErrorMessage(error.message || 'Failed to verify email');
      }
    };

    verifyUserEmail();
  }, [token, router]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <>
            <Center mb="xl">
              <Loader size="xl" color="blue" />
            </Center>
            <Title order={2} align="center" mb="md">
              Verifying Your Email
            </Title>
            <Text align="center" size="sm" color="dimmed">
              Please wait while we verify your email address...
            </Text>
          </>
        );
      
      case 'success':
        return (
          <>
            <Center mb="xl">
              <IconCircleCheck size={48} color="var(--mantine-color-green-6)" />
            </Center>
            <Title order={2} align="center" mb="md">
              Email Verified Successfully!
            </Title>
            <Text align="center" size="sm" color="dimmed">
              Your email has been verified. You will be redirected to the login page shortly.
            </Text>
          </>
        );
      
      case 'error':
        return (
          <>
            <Center mb="xl">
              <IconAlertCircle size={48} color="var(--mantine-color-red-6)" />
            </Center>
            <Title order={2} align="center" mb="md">
              Verification Failed
            </Title>
            <Text align="center" size="sm" color="dimmed">
              {errorMessage}
            </Text>
            <Button
              variant="light"
              fullWidth
              onClick={() => router.push('/signin')}
              mt="md"
            >
              Return to Sign In
            </Button>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container size="xs" pt="xl">
      <Transition mounted transition="fade" duration={400} timingFunction="ease">
        {(styles) => (
          <Paper withBorder p="lg" radius="md" style={styles} shadow="md">
            {renderContent()}
          </Paper>
        )}
      </Transition>
    </Container>
  );
} 