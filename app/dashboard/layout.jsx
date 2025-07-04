"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar"; // Usando caminho relativo
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

  return (
    <div className={styles.layoutContainer}>
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
      </div>
    </div>
  );
}