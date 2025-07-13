"use client";

import { useState } from "react"; 
import { signOut } from "next-auth/react"; 
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import styles from "./layout.module.css";

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' }) 
      .then(() => {
        document.cookie = 'next-auth.session-token=; Max-Age=-99999999; Path=/;';
        document.cookie = 'next-auth.csrf-token=; Max-Age=-99999999; Path=/;';
      })
      .catch((err) => {
        console.error('SignOut Error:', err);
      });
  };

  return (
    <div className={styles.layoutContainer}>
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />
      
      <div className={styles.mainContent}>
        <header className={styles.mobileHeader}>
          <button onClick={toggleMobileMenu} className={styles.menuButton}>
            <Menu size={24} />
          </button>
        </header>
        
        {isMobileMenuOpen && (
          <div className={styles.overlay} onClick={closeMobileMenu}></div>
        )}
        
        <div className={styles.pageWrapper}>
          {children}
        </div>

        <button onClick={handleSignOut} className={styles.logoutBtn}>Sair</button>
      </div>
    </div>
  );
}