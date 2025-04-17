'use client';

import { Suspense, useState, useEffect } from 'react';
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
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { verifyEmail } from '@apis/auth/authApi';

function VerifyEmailPageContent() {
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Verification token is missing');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setTimeout(() => router.push('/signin'), 3000);
      } catch (err) {
        console.error(err);
        setStatus('error');
        setErrorMessage(err.message || 'Failed to verify email');
      }
    };

    verify();
  }, [token, router]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <>
            <Center mb="xl"><Loader size="xl" color="blue" /></Center>
            <Title align="center" mb="md">Verifying Your Email</Title>
            <Text align="center" size="sm" color="dimmed">Please wait while we verify your email address...</Text>
          </>
        );
      case 'success':
        return (
          <>
            <Center mb="xl"><IconCircleCheck size={48} color="green" /></Center>
            <Title align="center" mb="md">Email Verified Successfully!</Title>
            <Text align="center" size="sm" color="dimmed">Redirecting you to sign in...</Text>
          </>
        );
      case 'error':
        return (
          <>
            <Center mb="xl"><IconAlertCircle size={48} color="red" /></Center>
            <Title align="center" mb="md">Verification Failed</Title>
            <Text align="center" size="sm" color="dimmed">{errorMessage}</Text>
            <Button fullWidth mt="md" onClick={() => router.push('/signin')}>Return to Sign In</Button>
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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
