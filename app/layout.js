'use client';

import { SessionProvider } from 'next-auth/react';
import AppLayout from './components/AppLayout'; 
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          <AppLayout>{children}</AppLayout>
        </SessionProvider>
      </body>
    </html>
  );
}