'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      router.replace('/signin');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  // Show nothing while checking authorization
  if (!authorized) {
    return null;
  }

  return children;
}
