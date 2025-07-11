// app/dashboard/layout.jsx
"use client";

import { useState } from "react"; // Removido: useEffect, useSession, useRouter
import { signOut } from "next-auth/react"; // Mantido: signOut para o botão de logout
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import styles from "./layout.module.css";
// Removido: Header (já está no AppLayout)

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Removido: const { data: session, status } = useSession();
  // Removido: const router = useRouter();

  // Removido: useEffect de verificação de sessão. Agora o AppLayout faz isso.
  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.push('/');
  //   }
  // }, [status, router]);

  // Removido: Loading state. Agora o AppLayout faz isso.
  // if (status === 'loading') {
  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--text-muted)' }}>
  //       Carregando painel...
  //     </div>
  //   );
  // }

  // Removido: Redirecionamento explícito para !session. Agora o AppLayout faz isso.
  // if (!session) {
  //   return null; 
  // }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' }) // Redireciona para a raiz (página de login)
      .then(() => {
        // Opcional: Limpar cookies manualmente se necessário, embora next-auth geralmente lide com isso
        document.cookie = 'next-auth.session-token=; Max-Age=-99999999; Path=/;';
        document.cookie = 'next-auth.csrf-token=; Max-Age=-99999999; Path=/;';
      })
      .catch((err) => {
        console.error('SignOut Error:', err);
      });
  };

  return (
    <div className={styles.layoutContainer}>
      {/* O Sidebar deve estar sempre presente no layout do dashboard */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />
      
      <div className={styles.mainContent}>
        {/* Este header SÓ deve aparecer no mobile, graças à classe abaixo */}
        <header className={styles.mobileHeader}>
          <button onClick={toggleMobileMenu} className={styles.menuButton}>
            <Menu size={24} />
          </button>
        </header>
        
        {/* O overlay SÓ aparece quando o menu está aberto no mobile */}
        {isMobileMenuOpen && (
          <div className={styles.overlay} onClick={closeMobileMenu}></div>
        )}
        
        <div className={styles.pageWrapper}>
          {children}
        </div>

        {/* Botão de Logout fixo */}
        <button onClick={handleSignOut} className={styles.logoutBtn}>Sair</button>
      </div>
    </div>
  );
}