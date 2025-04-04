'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Paper,
  Title,
  Text,
  Group,
  Divider,
  Transition,
  Center,
  Anchor,
} from '@mantine/core';
import { useLogin, useSignUp } from '@hooks/useAuth';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { isAuthenticated } from '@utils/authGuard';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState('signin');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  
  const { mutate: login, isLoading: loginLoading, error: loginError } = useLogin();
  const { mutate: signUp, isLoading: signUpLoading, error: signUpError } = useSignUp();

  const handleSubmit = () => {
    if (mode === 'signin') {
      login(
        { email: formData.email, password: formData.password },
        {
          onSuccess: (res) => {
            const { accessToken, refreshToken } = res.tokens;
            localStorage.setItem('auth_token', accessToken);
            document.cookie = `refresh_token=${refreshToken}; path=/; secure; samesite=strict;`;
            showNotification({ title: 'Success', message: 'Login successful!', color: 'green', icon:  <IconCircleCheck size={20} />, });
            router.push('/videos');
          },
          onError: (err) => {
            showNotification({ title: 'Error', message: err.message, color: 'red', icon: <IconAlertCircle />, });
          }
        }
      );
    } else {
      signUp(
        formData,
        {
          onSuccess: (res) => {
            showNotification({ title: 'Success', message: res.message || 'Sign up successful!', color: 'green' });
            router.push('/verify-email-sent');
          },
          onError: (err) => {
            showNotification({ title: 'Error', message: err.message, color: 'red' });
          }
        }
      );
    }
  };

  const isFormValid = () => {
    if (!formData.email || !formData.password) return false;
    if (mode === 'signup' && !formData.name) return false;
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return false;
    if (formData.password.length < 6) return false;
    return true;
  };

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/videos');
    }
  }, []);
  

  return (
    <Container size="xs" pt="xl">
      <Transition mounted transition="fade" duration={400} timingFunction="ease">
        {(styles) => (
          <Paper withBorder p="lg" radius="md" style={styles} shadow="md">
            <Title order={2} align="center" mb="md">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </Title>
            <Text align="center" size="sm" color="dimmed" mb="xl">
              {mode === 'signin'
                ? 'Sign in to access your dashboard'
                : 'Sign up and start your journey'}
            </Text>

            {mode === 'signup' && (
              <TextInput
                variant="default"
                label="Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                mb="sm"
              />
            )}

            <TextInput
              variant="default"
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              mb="sm"
            />

            <PasswordInput
              variant="default"
              label="Password"
              placeholder="Your secure password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              mb="md"
            />

            <Button fullWidth loading={loginLoading || signUpLoading} onClick={handleSubmit} disabled={!isFormValid}>
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>

            <Divider my="lg" />

            <Center>
              <Group spacing="xs">
                <Text size="sm">
                  {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                </Text>
                <Anchor size="sm" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </Anchor>
              </Group>
            </Center>
          </Paper>
        )}
      </Transition>
    </Container>
  );
}
