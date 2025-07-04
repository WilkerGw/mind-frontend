"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result.error) {
      setError("Usuário ou senha inválidos. Tente novamente.");
    } else if (result.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <section className={styles.loginSection}>
      <div className={styles.loginContainer}>
        <Image
          src="/images/logo-cinza.png"
          alt="Logo da Ótica"
          width={150}
          height={50}
          priority
          className={styles.logoLogin}
        />
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="email">Usuário:</label>
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
            <label htmlFor="password">Senha:</label>
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
            {loading ? "Entrando..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}