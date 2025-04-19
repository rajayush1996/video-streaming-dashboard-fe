'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ClientProviders from './providers/ClientProviders';
import DashboardWrapper from './components/DashboardWrapper';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <DashboardWrapper>
            {children}
          </DashboardWrapper>
          <Toaster position="top-right" />
        </ClientProviders>
      </body>
    </html>
  );
}
