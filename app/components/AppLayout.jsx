"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';
import styles from './Styles/Layout.module.css';

// Rotas onde o Header NÃO deve aparecer
const noHeaderRoutes = ['/']; 

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const showHeader = !noHeaderRoutes.includes(pathname);

  return (
    <div className={showHeader ? styles.layoutWithHeader : styles.layoutWithoutHeader}>
      {showHeader && <Header />}
      <main className={showHeader ? styles.mainContent : styles.fullPageContent}>
        {children}
      </main>
    </div>
  );
}