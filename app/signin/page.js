'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextInput, Button, Container } from '@mantine/core';

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Dummy login logic
    router.push('/videos');
  };

  return (
    <Container size="xs" pt="xl">
      <TextInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <TextInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button fullWidth mt="md" onClick={handleLogin}>Sign In</Button>
    </Container>
  );
}
