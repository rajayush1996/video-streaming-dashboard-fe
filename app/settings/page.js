'use client'
import { Container, TextInput, Button } from '@mantine/core';
import { useState } from 'react';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ username: '', firstName: '', lastName: '', password: '' });

  const handleSave = () => {
    console.log('Saving profile:', profile);
  };

  return (
    <Container>
      <TextInput label="Username" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
      <TextInput label="First Name" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
      <TextInput label="Last Name" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
      <TextInput label="Change Password" type="password" value={profile.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
      <Button mt="md" onClick={handleSave}>Save Settings</Button>
    </Container>
  );
}
