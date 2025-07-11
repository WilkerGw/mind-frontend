// app/layout.js
'use client';

import { SessionProvider } from 'next-auth/react';
import AppLayout from './components/AppLayout'; // Importamos nosso novo componente
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          {/* AppLayout agora gerencia a proteção globalmente */}
          <AppLayout>{children}</AppLayout>
        </SessionProvider>
      </body>
    </html>
  );
}