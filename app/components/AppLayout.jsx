"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Header from './Header';
import styles from './Layout.module.css';

const publicPaths = ['/', '/register'];

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    if (status === 'loading') return;

    if (!isPublicPath && status === 'unauthenticated') {
      router.push('/');
    } 
    else if (isPublicPath && status === 'authenticated' && pathname === '/') {
        router.push('/dashboard');
    }
  }, [status, router, isPublicPath, pathname]);

  if (isPublicPath) {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--text-muted)' }}>
        A carregar...
      </div>
    );
  }

  if (session) {
    return (
      <div className={styles.layoutWithHeader}>
        <Header />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    );
  }

  return null;
}