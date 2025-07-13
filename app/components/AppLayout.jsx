"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Header from './Header';
import styles from './Layout.module.css';

const noHeaderRoutes = ['/'];

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const showHeader = !noHeaderRoutes.includes(pathname);
  const isProtectedRoute = pathname !== '/';

  useEffect(() => {
    if (isProtectedRoute && status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router, isProtectedRoute, pathname]);

  if (isProtectedRoute && status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--text-muted)' }}>
        Carregando...
      </div>
    );
  }

  if (isProtectedRoute && !session) {
    return null;
  }

  return (
    <div className={showHeader ? styles.layoutWithHeader : styles.layoutWithoutHeader}>
      {showHeader && <Header />}
      <main className={showHeader ? styles.mainContent : styles.fullPageContent}>
        {children}
      </main>
    </div>
  );
}