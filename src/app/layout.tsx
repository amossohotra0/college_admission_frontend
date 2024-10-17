'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { queryClient } from '@/hooks/useApi';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <Layout>
            {children}
          </Layout>
          <Toaster position="top-right" />
        </QueryClientProvider>
      </body>
    </html>
  );
}