// app/components/AppLayout.jsx
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react'; // Adicione esta linha para importar o useEffect
import Header from './Header';
import styles from './Styles/Layout.module.css';

// Rotas que NÃO devem ter o Header ou NÃO precisam de autenticação
const noHeaderRoutes = ['/']; // Apenas a página de login não precisa de Header ou autenticação para ser acessada.

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const showHeader = !noHeaderRoutes.includes(pathname);
  const isProtectedRoute = pathname !== '/'; // Todas as rotas que não são a raiz são protegidas

  // Efeito para verificar o status da autenticação globalmente
  useEffect(() => {
    // Se a rota é protegida E o status é 'unauthenticated', redireciona para a página de login
    if (isProtectedRoute && status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router, isProtectedRoute, pathname]);

  // Se a rota é protegida E o status é 'loading', exibe um carregamento
  if (isProtectedRoute && status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--text-muted)' }}>
        Carregando...
      </div>
    );
  }

  // Se a rota é protegida E NÃO HÁ sessão (e não está carregando), não renderiza o conteúdo protegido
  // O redirecionamento já ocorreu no useEffect.
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