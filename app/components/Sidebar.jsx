"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, LayoutDashboard, Users, Package, ShoppingCart, Ticket, FileText, Calendar } from "lucide-react";
import styles from "./Sidebar.module.css";

const navLinks = [
  { href: "/dashboard", text: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", text: "Clientes", icon: Users },
  { href: "/products", text: "Produtos", icon: Package },
  { href: "/sales", text: "Vendas", icon: ShoppingCart },
  { href: "/promotions", text: "Promoções", icon: Ticket },
  { href: "/boletos", text: "Boletos", icon: FileText },
  { href: "/agendamento", text: "Agendamentos", icon: Calendar },
];

export default function Sidebar({ isMobileMenuOpen, closeMobileMenu }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}>
      <div className={styles.sidebarHeader}>
        <Link href="/dashboard" className={styles.logoLink} onClick={closeMobileMenu}>
          <Eye className={styles.logoIcon} />
          <span className={styles.logoText}>Mind CRM</span>
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${isActive(link.href) ? styles.active : ""}`}
                onClick={closeMobileMenu} // Fecha o menu ao clicar em um link no mobile
              >
                <link.icon className={styles.navIcon} />
                <span className={styles.navText}>{link.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}