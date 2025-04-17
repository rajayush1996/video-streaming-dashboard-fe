'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Center,
  Stack,
  Transition,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconCircleCheck, IconMail } from '@tabler/icons-react';
import { resendVerification } from '@apis/auth/authApi';
import { Suspense } from 'react';

export  function VerifyEmailSent() {
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  // Get timer value from environment variable or default to 30 seconds
  const resendTimer = parseInt(process.env.NEXT_PUBLIC_EMAIL_RESEND_TIMER || '30', 10);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      await resendVerification(email);
      showNotification({
        title: 'Success',
        message: 'Verification email has been resent!',
        color: 'green',
        icon: <IconCircleCheck size={20} />,
      });
      // Start the countdown after successful resend
      setCountdown(resendTimer);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to resend verification email',
        color: 'red',
        icon: <IconAlertCircle size={20} />,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Container size="xs" pt="xl">
      <Transition mounted transition="fade" duration={400} timingFunction="ease">
        {(styles) => (
          <Paper withBorder p="lg" radius="md" style={styles} shadow="md">
            <Center mb="xl">
              <IconMail size={48} color="var(--mantine-color-blue-6)" />
            </Center>
            
            <Title order={2} align="center" mb="md">
              Verify Your Email
            </Title>

            <Stack spacing="md">
              <Text align="center" size="sm" color="dimmed">
                We've sent a verification email to:
              </Text>
              <Text align="center" weight={500}>
                {email}
              </Text>
              <Text align="center" size="sm" color="dimmed">
                Please check your inbox and click the verification link to complete your registration.
              </Text>

              <Button
                variant="light"
                fullWidth
                onClick={handleResendEmail}
                loading={isResending}
                disabled={countdown > 0}
                mt="md"
              >
                {countdown > 0 
                  ? `Resend available in ${countdown}s` 
                  : 'Resend Verification Email'}
              </Button>
            </Stack>
          </Paper>
        )}
      </Transition>
    </Container>
    </Suspense>

  );
}

// Wrap the component in Suspense to handle client-side navigation hooks
export default function VerifyEmailSentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailSent />
    </Suspense>
  );
}
