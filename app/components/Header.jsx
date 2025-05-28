"use client";
import Link from "next/link";
import styles from "../components/Styles/Header.module.css";
import { useState } from "react";
import {
  FaHome,
  FaUser,
  FaBox,
  FaCashRegister,
  FaGift,
  FaFileInvoice,
} from "react-icons/fa"; // Ícones do Font Awesome
import { MdDashboard } from "react-icons/md"; // Ícone do Material Icons
import { BsCalendar2DateFill } from "react-icons/bs"; // Ícone do Bootstrap Icons

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null); // Novo estado para rastrear o item ativo

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLinkClick = (index) => {
    setActiveLink(index); // Atualiza o item ativo
    closeMenu(); // Fecha o menu mobile
  };

  return (
    <header className={styles.header}>
      <div className={styles.containerLogo}>
        <img
          src="/images/logo-amarela.png"
          alt="Logo"
          className={styles.logo}
        />
      </div>

      {/* Botão hamburguer (visível em todas as telas, mas oculto no desktop via CSS) */}
      <button className={styles.menuToggle} onClick={toggleMenu}>
        {isMenuOpen ? "×" : "☰"}
      </button>

      {/* Menu mobile (baseado em mobile-first) */}
      <nav className={`${styles.mobileNav} ${isMenuOpen ? styles.active : ""}`}>
        <ul className={styles.navLinks}>
          <Link href="/dashboard" onClick={closeMenu}>
            <li
              className={
                activeLink === 0
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(0)}
            >
              <MdDashboard
                size={20}
                className={`${styles.icon} ${
                  activeLink === 0 ? styles.activeIcon : ""
                }`}
              />
              Dashboard
            </li>
          </Link>
          <Link href="/clients" onClick={closeMenu}>
            <li
              className={
                activeLink === 1
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(1)}
            >
              <FaUser
                size={20}
                className={`${styles.icon} ${
                  activeLink === 1 ? styles.activeIcon : ""
                }`}
              />
              Clientes
            </li>
          </Link>
          <Link href="/products" onClick={closeMenu}>
            <li
              className={
                activeLink === 2
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(2)}
            >
              <FaBox
                size={20}
                className={`${styles.icon} ${
                  activeLink === 2 ? styles.activeIcon : ""
                }`}
              />
              Produtos
            </li>
          </Link>
          <Link href="/sales" onClick={closeMenu}>
            <li
              className={
                activeLink === 3
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(3)}
            >
              <FaCashRegister
                size={20}
                className={`${styles.icon} ${
                  activeLink === 3 ? styles.activeIcon : ""
                }`}
              />
              Vendas
            </li>
          </Link>
          <Link href="/promotions" onClick={closeMenu}>
            <li
              className={
                activeLink === 4
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(4)}
            >
              <FaGift
                size={20}
                className={`${styles.icon} ${
                  activeLink === 4 ? styles.activeIcon : ""
                }`}
              />
              Promoções
            </li>
          </Link>
          <Link href="/boletos" onClick={closeMenu}>
            <li
              className={
                activeLink === 5
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(5)}
            >
              <FaFileInvoice
                size={20}
                className={`${styles.icon} ${
                  activeLink === 5 ? styles.activeIcon : ""
                }`}
              />
              Boletos
            </li>
          </Link>
          <Link href="/agendamento" onClick={closeMenu}>
            <li
              className={
                activeLink === 6
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(6)}
            >
              <BsCalendar2DateFill
                size={20}
                className={`${styles.icon} ${
                  activeLink === 6 ? styles.activeIcon : ""
                }`}
              />
              Agendamentos
            </li>
          </Link>
        </ul>
      </nav>

      {/* Navegação desktop (apenas visível em telas grandes) */}
      <nav className={styles.desktopNav}>
        <ul className={styles.navLinks}>
          <Link href="/dashboard">
            <li
              className={
                activeLink === 0
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(0)}
            >
              <MdDashboard
                size={20}
                className={`${styles.icon} ${
                  activeLink === 0 ? styles.activeIcon : ""
                }`}
              />
              Dashboard
            </li>
          </Link>
          <Link href="/clients">
            <li
              className={
                activeLink === 1
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(1)}
            >
              <FaUser
                size={20}
                className={`${styles.icon} ${
                  activeLink === 1 ? styles.activeIcon : ""
                }`}
              />
              Clientes
            </li>
          </Link>
          <Link href="/products">
            <li
              className={
                activeLink === 2
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(2)}
            >
              <FaBox
                size={20}
                className={`${styles.icon} ${
                  activeLink === 2 ? styles.activeIcon : ""
                }`}
              />
              Produtos
            </li>
          </Link>
          <Link href="/sales">
            <li
              className={
                activeLink === 3
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(3)}
            >
              <FaCashRegister
                size={20}
                className={`${styles.icon} ${
                  activeLink === 3 ? styles.activeIcon : ""
                }`}
              />
              Vendas
            </li>
          </Link>{" "}
          <Link href="/promotions">
            <li
              className={
                activeLink === 4
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(4)}
            >
              <FaGift
                size={20}
                className={`${styles.icon} ${
                  activeLink === 4 ? styles.activeIcon : ""
                }`}
              />
              Promoções
            </li>
          </Link>
          <Link href="/boletos">
            <li
              className={
                activeLink === 5
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(5)}
            >
              <FaFileInvoice
                size={20}
                className={`${styles.icon} ${
                  activeLink === 5 ? styles.activeIcon : ""
                }`}
              />
              Boletos
            </li>
          </Link>
          <Link href="/agendamento">
            <li
              className={
                activeLink === 6
                  ? `${styles.link} ${styles.activeLink}`
                  : styles.link
              }
              onClick={() => handleLinkClick(6)}
            >
              <BsCalendar2DateFill
                size={20}
                className={`${styles.icon} ${
                  activeLink === 6 ? styles.activeIcon : ""
                }`}
              />
              Agendamentos
            </li>
          </Link>
        </ul>
      </nav>
    </header>
  );
}
