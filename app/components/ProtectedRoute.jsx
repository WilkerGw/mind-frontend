// my-nextjs-auth-app/app/components/ProtectedRoute.js
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from '../components/Styles/ProtectedRoute.module.css';
import Header from './Header';

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('Session Status:', status);
    if (status === 'unauthenticated') {
      router.push('http://localhost:3000/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: 'http://localhost:3000/' })
      .then((res) => {
        console.log('SignOut Result:', res);
        // Limpar cookies manualmente se necessário
        document.cookie = 'next-auth.session-token=; Max-Age=-99999999; Path=/;';
        document.cookie = 'next-auth.csrf-token=; Max-Age=-99999999; Path=/;';
      })
      .catch((err) => {
        console.error('SignOut Error:', err);
      });
  };

  return (
    <>
    <Header/>
      {children}
      <button onClick={handleSignOut} className={styles.logoutBtn}>Logout</button>
    </>
  );
}