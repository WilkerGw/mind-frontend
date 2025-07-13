"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./Header.module.css";
import { 
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Gift,
  FileText,
  Calendar
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", text: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", text: "Clientes", icon: Users },
  { href: "/products", text: "Produtos", icon: Package },
  { href: "/sales", text: "Vendas", icon: ShoppingCart },
  { href: "/boletos", text: "Boletos", icon: FileText },
  { href: "/agendamento", text: "Agendamentos", icon: Calendar },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.containerLogo}>
          <Link href="/dashboard">
            <Image
              src="/images/logo-amarela.png"
              alt="Logo"
              width={80}
              height={55}
              className={styles.logo}
            />
          </Link>
        </div>

        <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Abrir menu">
          {isMenuOpen ? "×" : "☰"}
        </button>
        
        <nav className={`${styles.navContainer} ${isMenuOpen ? styles.active : ""}`}>
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={closeMenu} className={`${styles.link} ${isActive(link.href) ? styles.activeLink : ""}`}>
                    <link.icon size={20} className={styles.icon} />
                    <span>{link.text}</span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </header>
      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
    </>
  );
}