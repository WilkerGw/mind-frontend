/* eslint-disable @next/next/no-img-element */
// my-nextjs-auth-app/app/auth/login/page.js
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });

    console.log("SignIn Result:", result); // Adicione este console.log

    if (result.error) {
      alert(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <section className={styles.loginSection}>
      <div className={styles.loginContainer}>
      <img src="/images/logo-cinza.png" alt="logo imagem" className={styles.logoLogin} />
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label>Usuário:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div>
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
