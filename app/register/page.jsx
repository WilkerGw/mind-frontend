// app/register/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { registerUser } from "../../lib/auth-api";
import styles from "../page.module.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser({ name, email, password });
      alert("Utilizador registado com sucesso! Por favor, faça o login.");
      router.push("/");
    } catch (err) {
      setError(err.message || "Falha ao registar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.loginSection}>
      <div className={styles.loginContainer}>
        <Image
          src="/images/logo-amarela.png"
          alt="Logo da Ótica"
          width={120}
          height={50}
          priority
          className={styles.logoLogin}
          style={{ height: 'auto' }}
        />
        <h2 style={{ marginBottom: '1.5rem', color: '#e0e0e0' }}>Criar Nova Conta</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="name" className={styles.label}>Nome:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="seuemail@exemplo.com"
            />
          </div>
          <div>
            <label htmlFor="password" className={styles.label}>Senha:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="********"
            />
          </div>
          
          {error && <p className={styles.errorMessage}>{error}</p>}
          
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "A registar..." : "Registar"}
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Já tem uma conta?{" "}
          <Link href="/" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
            Faça o login aqui
          </Link>
        </p>
      </div>
    </section>
  );
}