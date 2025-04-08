'use client';
import AuthGuard from '@utils/authGuard';

export default function Layout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
